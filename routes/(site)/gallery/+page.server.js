import { getGallery, getSeo } from '$lib/server/data.js';

export async function load() {
	const [seo, items] = await Promise.all([getSeo('gallery'), getGallery()]);
	return { seo, items };
}
