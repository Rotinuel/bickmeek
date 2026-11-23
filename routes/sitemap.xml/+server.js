import { getServices, siteUrl } from '$lib/server/data.js';

const STATIC = [
	{ path: '/', priority: '1.0', changefreq: 'weekly' },
	{ path: '/services', priority: '0.9', changefreq: 'monthly' },
	{ path: '/cleaning-plans', priority: '0.9', changefreq: 'monthly' },
	{ path: '/cleaning-subscription', priority: '0.8', changefreq: 'monthly' },
	{ path: '/book', priority: '0.8', changefreq: 'yearly' },
	{ path: '/about', priority: '0.6', changefreq: 'yearly' },
	{ path: '/gallery', priority: '0.7', changefreq: 'weekly' },
	{ path: '/testimonials', priority: '0.6', changefreq: 'monthly' },
	{ path: '/contact', priority: '0.7', changefreq: 'yearly' },
	{ path: '/privacy-policy', priority: '0.2', changefreq: 'yearly' },
	{ path: '/terms', priority: '0.2', changefreq: 'yearly' }
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export async function GET({ url }) {
	const base = siteUrl(url);
	const services = await getServices();
	const entries = [
		...STATIC.map((e) => ({ ...e, lastmod: null })),
		...services.map((s) => ({
			path: `/services/${s.slug}`,
			priority: '0.8',
			changefreq: 'monthly',
			lastmod: s.updatedAt ? new Date(s.updatedAt).toISOString().slice(0, 10) : null
		}))
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(e) => `	<url>
		<loc>${esc(base + (e.path === '/' ? '/' : e.path))}</loc>${e.lastmod ? `\n		<lastmod>${e.lastmod}</lastmod>` : ''}
		<changefreq>${e.changefreq}</changefreq>
		<priority>${e.priority}</priority>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
	});
}
