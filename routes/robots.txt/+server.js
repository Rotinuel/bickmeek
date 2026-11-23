import { env } from '$env/dynamic/public';

export function GET({ url }) {
	const base = (env.PUBLIC_SITE_URL || url.origin).replace(/\/+$/, '');
	const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Sitemap: ${base}/sitemap.xml
`;
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
}
