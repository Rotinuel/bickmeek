import { getServices, getSettings, siteUrl } from '$lib/server/data.js';

export async function load({ url, locals }) {
	const [settings, services] = await Promise.all([getSettings(), getServices()]);
	return {
		settings,
		services: services.map((s) => ({ slug: s.slug, name: s.name, icon: s.icon, shortDescription: s.shortDescription })),
		siteUrl: siteUrl(url),
		admin: locals.admin
	};
}
