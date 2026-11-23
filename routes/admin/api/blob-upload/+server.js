import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { UPLOAD_LIMITS } from '$lib/constants.js';

/**
 * Issues short-lived tokens so the browser can upload large videos straight to Vercel Blob,
 * bypassing the 4.5 MB serverless request limit. Only used when STORAGE_DRIVER=blob.
 * Admin-only: hooks.server.js rejects unauthenticated /admin/api requests.
 */
export async function POST({ request, locals }) {
	if (!locals.admin) error(401, 'Unauthorised');
	if ((env.STORAGE_DRIVER || '').toLowerCase() !== 'blob') error(400, 'Blob storage is not enabled.');

	const { handleUpload } = await import('@vercel/blob/client');
	const body = await request.json();
	try {
		const result = await handleUpload({
			body,
			request,
			token: env.BLOB_READ_WRITE_TOKEN,
			onBeforeGenerateToken: async () => ({
				allowedContentTypes: [...UPLOAD_LIMITS.videoTypes, ...UPLOAD_LIMITS.imageTypes],
				maximumSizeInBytes: UPLOAD_LIMITS.videoBytes * 4,
				addRandomSuffix: true
			}),
			onUploadCompleted: async () => {}
		});
		return json(result);
	} catch (err) {
		return json({ error: err?.message || 'Upload failed' }, { status: 400 });
	}
}
