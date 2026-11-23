import { getSeo, getServices } from '$lib/server/data.js';

export async function load() {
	const [seo, services] = await Promise.all([getSeo('services'), getServices()]);
	return { seo, fullServices: services };
}
