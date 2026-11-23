import { serveMedia } from '$lib/server/storage.js';

export async function GET({ params, request }) {
	return serveMedia(params.driver, params.key, request.headers.get('range'));
}
