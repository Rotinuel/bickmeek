import { error, fail, isHttpError, isRedirect } from '@sveltejs/kit';
import { deleteUpload, formFile, saveUpload, UploadError } from './storage.js';
import { invalidateContent } from './data.js';
import { bool, clean, isSafeUrl } from './validate.js';

/** Defence in depth: hooks already block anonymous admin requests. */
export function requireAdmin(locals) {
	if (!locals.admin) error(401, 'Please sign in.');
	return locals.admin;
}

/**
 * Handles an image (or video) field made of: a file input `<name>File`, an optional
 * URL input `<name>Url`, and a "remove" checkbox `<name>Remove`.
 * Returns { url, key } to store, or the current values when nothing changed.
 */
export async function mediaField(fd, name, current = {}, { kind = 'image' } = {}) {
	const file = formFile(fd, `${name}File`);
	const url = clean(fd.get(`${name}Url`), 600);
	const remove = bool(fd.get(`${name}Remove`));

	if (file) {
		const saved = await saveUpload(file, { kind });
		if (current.key) await deleteUpload(current.key);
		return saved;
	}
	if (remove) {
		if (current.key) await deleteUpload(current.key);
		return { url: '', key: '' };
	}
	if (url && url !== current.url) {
		if (!isSafeUrl(url)) throw new UploadError('Use a full https:// link or upload a file instead.');
		if (current.key) await deleteUpload(current.key);
		return { url, key: '' };
	}
	return { url: current.url || '', key: current.key || '' };
}

/** Wraps an admin action: catches upload errors and clears the public content cache on success. */
export function adminAction(fn) {
	return async (event) => {
		requireAdmin(event.locals);
		try {
			const result = await fn(event);
			invalidateContent();
			return result;
		} catch (err) {
			if (isRedirect(err) || isHttpError(err)) throw err;
			if (err instanceof UploadError) return fail(400, { error: err.message });
			if (err?.name === 'ValidationError') {
				return fail(400, { error: Object.values(err.errors).map((e) => e.message).join(' ') });
			}
			if (err?.code === 11000) return fail(400, { error: 'That value is already in use. Choose a different one.' });
			console.error('[admin action]', err);
			return fail(500, { error: 'Something went wrong while saving. Please try again.' });
		}
	};
}
