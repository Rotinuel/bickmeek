import { randomBytes } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import mongoose from 'mongoose';
import { env } from '$env/dynamic/private';
import { UPLOAD_LIMITS } from '../constants.js';

/**
 * Pluggable media storage. Pick with STORAGE_DRIVER:
 *   gridfs (default) – files live in MongoDB, served from /media/g/<id>. No extra service.
 *   blob             – Vercel Blob public URLs (needs BLOB_READ_WRITE_TOKEN). Best for large videos.
 *   local            – ./uploads on disk, served from /media/l/<file>. Development only.
 * Every upload returns { url, key }; store both. `key` is what deleteUpload needs.
 */

export const storageDriver = () => (env.STORAGE_DRIVER || 'gridfs').toLowerCase();

const EXT = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/avif': 'avif',
	'video/mp4': 'mp4',
	'video/webm': 'webm'
};

export class UploadError extends Error {}

/** Detects the real type from the file's first bytes instead of trusting the browser. */
function sniff(buf) {
	const ascii = (s, e) => buf.subarray(s, e).toString('latin1');
	if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
	if (buf[0] === 0x89 && ascii(1, 4) === 'PNG') return 'image/png';
	if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
	if (ascii(4, 8) === 'ftyp') {
		const brand = ascii(8, 12);
		if (brand === 'avif' || brand === 'avis') return 'image/avif';
		return 'video/mp4';
	}
	if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return 'video/webm';
	return null;
}

/** Returns a File from FormData only if one was actually chosen. */
export function formFile(formData, name) {
	const f = formData.get(name);
	return f && typeof f === 'object' && 'arrayBuffer' in f && f.size > 0 ? f : null;
}

export async function saveUpload(file, { kind = 'image' } = {}) {
	const allowed = kind === 'video' ? UPLOAD_LIMITS.videoTypes : UPLOAD_LIMITS.imageTypes;
	const maxBytes = kind === 'video' ? UPLOAD_LIMITS.videoBytes : UPLOAD_LIMITS.imageBytes;

	if (file.size > maxBytes) {
		throw new UploadError(`“${file.name}” is larger than ${Math.round(maxBytes / 1024 / 1024)} MB. Compress it and try again.`);
	}
	const buffer = Buffer.from(await file.arrayBuffer());
	const type = sniff(buffer);
	if (!type || !allowed.includes(type)) {
		throw new UploadError(
			kind === 'video'
				? `“${file.name}” is not an MP4 or WebM video.`
				: `“${file.name}” is not a JPG, PNG, WebP or AVIF image.`
		);
	}
	const filename = `${Date.now().toString(36)}-${randomBytes(6).toString('hex')}.${EXT[type]}`;
	const driver = storageDriver();

	if (driver === 'blob') {
		const { put } = await import('@vercel/blob');
		const blob = await put(`bicemeek/${filename}`, buffer, {
			access: 'public',
			contentType: type,
			token: env.BLOB_READ_WRITE_TOKEN
		});
		return { url: blob.url, key: `blob:${blob.url}` };
	}

	if (driver === 'local') {
		const dir = path.resolve(env.UPLOAD_DIR || './uploads');
		await mkdir(dir, { recursive: true });
		await writeFile(path.join(dir, filename), buffer);
		return { url: `/media/l/${filename}`, key: `local:${filename}` };
	}

	const bucket = gridBucket();
	const id = await new Promise((resolve, reject) => {
		const stream = bucket.openUploadStream(filename, { metadata: { contentType: type } });
		stream.once('error', reject);
		stream.once('finish', () => resolve(stream.id));
		stream.end(buffer);
	});
	return { url: `/media/g/${id}`, key: `gridfs:${id}` };
}

export async function deleteUpload(key) {
	if (!key || typeof key !== 'string') return;
	try {
		if (key.startsWith('gridfs:')) {
			const id = key.slice(7);
			if (mongoose.isValidObjectId(id)) await gridBucket().delete(new mongoose.Types.ObjectId(id));
		} else if (key.startsWith('local:')) {
			const name = path.basename(key.slice(6));
			await unlink(path.join(path.resolve(env.UPLOAD_DIR || './uploads'), name));
		} else if (key.startsWith('blob:')) {
			const { del } = await import('@vercel/blob');
			await del(key.slice(5), { token: env.BLOB_READ_WRITE_TOKEN });
		}
	} catch (err) {
		console.warn('[storage] delete failed', key, err?.message);
	}
}

function gridBucket() {
	return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'media' });
}

function parseRange(header, size) {
	const m = /^bytes=(\d*)-(\d*)$/.exec(header || '');
	if (!m) return null;
	let start = m[1] === '' ? size - Number(m[2]) : Number(m[1]);
	let end = m[1] !== '' && m[2] !== '' ? Number(m[2]) : size - 1;
	if (Number.isNaN(start) || Number.isNaN(end) || start < 0 || start > end || end >= size) return 'invalid';
	return { start, end };
}

function mediaResponse(nodeStream, { size, type, range, start, end }) {
	const headers = {
		'Content-Type': type,
		'Accept-Ranges': 'bytes',
		'Cache-Control': 'public, max-age=31536000, immutable',
		'X-Content-Type-Options': 'nosniff'
	};
	if (range) {
		headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
		headers['Content-Length'] = String(end - start + 1);
		return new Response(Readable.toWeb(nodeStream), { status: 206, headers });
	}
	headers['Content-Length'] = String(size);
	return new Response(Readable.toWeb(nodeStream), { status: 200, headers });
}

/** Streams a stored file with HTTP range support (needed for video seeking). */
export async function serveMedia(driver, key, rangeHeader) {
	if (driver === 'g') {
		if (!mongoose.isValidObjectId(key)) return new Response('Not found', { status: 404 });
		const id = new mongoose.Types.ObjectId(key);
		const bucket = gridBucket();
		const [file] = await bucket.find({ _id: id }).limit(1).toArray();
		if (!file) return new Response('Not found', { status: 404 });
		const size = file.length;
		const type = file.metadata?.contentType || 'application/octet-stream';
		const range = parseRange(rangeHeader, size);
		if (range === 'invalid') return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
		if (range) {
			const stream = bucket.openDownloadStream(id, { start: range.start, end: range.end + 1 });
			return mediaResponse(stream, { size, type, range: true, ...range });
		}
		return mediaResponse(bucket.openDownloadStream(id), { size, type });
	}

	if (driver === 'l') {
		const name = path.basename(key);
		if (!/^[\w.-]+$/.test(name)) return new Response('Not found', { status: 404 });
		const full = path.join(path.resolve(env.UPLOAD_DIR || './uploads'), name);
		let info;
		try {
			info = await stat(full);
		} catch {
			return new Response('Not found', { status: 404 });
		}
		const ext = path.extname(name).slice(1);
		const type = Object.keys(EXT).find((t) => EXT[t] === ext) || 'application/octet-stream';
		const range = parseRange(rangeHeader, info.size);
		if (range === 'invalid') return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${info.size}` } });
		if (range) return mediaResponse(createReadStream(full, range), { size: info.size, type, range: true, ...range });
		return mediaResponse(createReadStream(full), { size: info.size, type });
	}

	return new Response('Not found', { status: 404 });
}
