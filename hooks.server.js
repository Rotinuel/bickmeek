import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { ensureDatabase } from '$lib/server/database.js';
import { getSessionAdmin, SESSION_COOKIE } from '$lib/server/auth.js';

const SECURITY_HEADERS = {
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
	'Cross-Origin-Opener-Policy': 'same-origin'
};

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const { pathname } = event.url;

	// Static-like endpoints that never need the database.
	if (pathname !== '/robots.txt') {
		await ensureDatabase();
	}

	event.locals.admin = null;
	const isAdminArea = pathname === '/admin' || pathname.startsWith('/admin/');

	if (isAdminArea) {
		const token = event.cookies.get(SESSION_COOKIE);
		event.locals.admin = token ? await getSessionAdmin(token) : null;

		const isLogin = pathname === '/admin/login';
		const isOpen = isLogin || pathname === '/admin/logout';
		if (!event.locals.admin && !isOpen) {
			// Protects pages, form actions and API endpoints alike.
			if (event.request.method !== 'GET' || pathname.startsWith('/admin/api/')) {
				return new Response('Unauthorised', { status: 401 });
			}
			redirect(303, `/admin/login?next=${encodeURIComponent(pathname + event.url.search)}`);
		}
		if (event.locals.admin && isLogin) redirect(303, '/admin');
	}

	const response = await resolve(event, {
		preload: ({ type }) => type === 'font' || type === 'js' || type === 'css'
	});

	for (const [k, v] of Object.entries(SECURITY_HEADERS)) response.headers.set(k, v);
	if (isAdminArea) {
		response.headers.set('X-Frame-Options', 'DENY');
		response.headers.set('Cache-Control', 'no-store');
		response.headers.set('X-Robots-Tag', 'noindex, nofollow');
	} else {
		response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	}
	if (!dev) response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	return response;
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error, event, status }) {
	if (status !== 404) console.error('[server error]', event.url.pathname, error);
	if (status === 404) return { message: 'We couldn’t find that page.' };
	// In development, show the real cause on the page; visitors in production never see it.
	if (dev) return { message: `[dev] ${error?.message || String(error)}` };
	return { message: 'Something went wrong on our side. Please try again, or reach us on WhatsApp.' };
}
