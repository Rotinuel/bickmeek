import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { Admin } from '$lib/server/models.js';
import { verifyPassword, DUMMY_HASH } from '$lib/server/password.js';
import { createSession, sessionCookieOptions, SESSION_COOKIE } from '$lib/server/auth.js';
import { rateLimit, resetRateLimit } from '$lib/server/rate-limit.js';
import { clean } from '$lib/server/validate.js';

export async function load() {
	const hasAdmin = (await Admin.estimatedDocumentCount()) > 0;
	return { hasAdmin };
}

function safeNext(value) {
	const v = String(value || '');
	return v.startsWith('/admin') && !v.startsWith('//') ? v : '/admin';
}

export const actions = {
	default: async ({ request, cookies, getClientAddress, url }) => {
		const fd = await request.formData();
		const email = clean(fd.get('email'), 160).toLowerCase();
		const password = String(fd.get('password') ?? '').slice(0, 200);
		const ip = getClientAddress();

		const perIp = await rateLimit('login-ip', ip, { limit: 20, windowSeconds: 900 });
		const perAccount = await rateLimit('login', `${ip}|${email}`, { limit: 5, windowSeconds: 900 });
		if (!perIp.ok || !perAccount.ok) {
			const wait = Math.ceil(Math.max(perIp.retryAfter || 0, perAccount.retryAfter || 0) / 60);
			return fail(429, { email, error: `Too many sign-in attempts. Try again in ${wait} minute(s).` });
		}

		if (!email || !password) return fail(400, { email, error: 'Enter your email and password.' });

		const admin = await Admin.findOne({ email });
		const ok = await verifyPassword(password, admin?.passwordHash ?? DUMMY_HASH);
		if (!admin || !ok) return fail(400, { email, error: 'That email and password don’t match.' });

		await resetRateLimit('login', `${ip}|${email}`);
		admin.lastLoginAt = new Date();
		await admin.save();

		const { token, expiresAt } = await createSession(admin._id, request.headers.get('user-agent'));
		cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt, !dev));
		redirect(303, safeNext(url.searchParams.get('next')));
	}
};
