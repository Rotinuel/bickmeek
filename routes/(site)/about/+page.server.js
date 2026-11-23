import { getSeo } from '$lib/server/data.js';

export async function load() {
	return { seo: await getSeo('about') };
}
