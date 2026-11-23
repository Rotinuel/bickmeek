import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { plain } from '$lib/server/db.js';
import { Admin, Settings } from '$lib/server/models.js';
import { adminAction, mediaField } from '$lib/server/admin.js';
import { hashPassword, verifyPassword } from '$lib/server/password.js';
import { createSession, destroyAllSessions, sessionCookieOptions, SESSION_COOKIE } from '$lib/server/auth.js';
import { DEFAULT_SETTINGS } from '$lib/server/seed-data.js';
import { clean, isEmail, isSafeUrl, normalisePhone, toWhatsAppNumber } from '$lib/server/validate.js';
import { dev } from '$app/environment';

export async function load() {
	const s = plain(await Settings.findOne({ key: 'site' }).lean()) ?? DEFAULT_SETTINGS;
	return {
		s: { ...DEFAULT_SETTINGS, ...s },
		envOverrides: {
			ga: Boolean(env.PUBLIC_GA_MEASUREMENT_ID),
			gsc: Boolean(env.PUBLIC_GOOGLE_SITE_VERIFICATION)
		}
	};
}

export const actions = {
	save: adminAction(async ({ request }) => {
		const fd = await request.formData();
		const doc = (await Settings.findOne({ key: 'site' })) ?? new Settings({ key: 'site' });

		const phones = [];
		for (const raw of fd.getAll('phone')) {
			if (!clean(raw)) continue;
			const p = normalisePhone(raw);
			if (!p) return fail(400, { error: `“${clean(raw)}” isn’t a valid phone number.` });
			phones.push(p);
		}

		const labels = fd.getAll('waLabel');
		const whatsapp = [];
		for (const [i, raw] of fd.getAll('waNumber').entries()) {
			if (!clean(raw)) continue;
			const n = toWhatsAppNumber(raw);
			if (!n) return fail(400, { error: `WhatsApp number “${clean(raw)}” isn’t valid. Use the full number, e.g. 2347016890048 or 07016890048.` });
			whatsapp.push({ label: clean(labels[i], 40) || `Line ${whatsapp.length + 1}`, number: n });
		}
		if (!whatsapp.length) return fail(400, { error: 'Keep at least one WhatsApp number — it’s the main way customers reach you.' });

		const hoursDays = fd.getAll('hoursDays');
		const openingHours = fd
			.getAll('hoursTime')
			.map((h, i) => ({ days: clean(hoursDays[i], 60), hours: clean(h, 60) }))
			.filter((o) => o.days || o.hours);

		const email = clean(fd.get('email'), 160).toLowerCase();
		if (email && !isEmail(email)) return fail(400, { error: 'Check the email address.' });

		const urls = {};
		for (const key of ['mapUrl', 'googleBusinessUrl', 'facebook', 'instagram', 'tiktok', 'x', 'linkedin', 'youtube']) {
			const v = clean(fd.get(key), 400);
			if (v && (!isSafeUrl(v) || v.startsWith('/'))) return fail(400, { error: `“${v}” isn’t a full web link (start with https://).` });
			urls[key] = v;
		}

		const ga = clean(fd.get('gaMeasurementId'), 20).toUpperCase();
		if (ga && !/^G-[A-Z0-9]{4,12}$/.test(ga)) return fail(400, { error: 'Google Analytics IDs look like G-XXXXXXXXXX.' });

		const hero = await mediaField(fd, 'hero', { url: doc.heroImage, key: doc.heroImageKey });
		const about = await mediaField(fd, 'about', { url: doc.aboutImage, key: doc.aboutImageKey });

		Object.assign(doc, {
			businessName: clean(fd.get('businessName'), 120) || DEFAULT_SETTINGS.businessName,
			tagline: clean(fd.get('tagline'), 160),
			slogan: clean(fd.get('slogan'), 160),
			phones,
			whatsapp,
			email,
			streetAddress: clean(fd.get('streetAddress'), 200),
			city: clean(fd.get('city'), 80),
			state: clean(fd.get('state'), 80),
			country: clean(fd.get('country'), 80),
			mapUrl: urls.mapUrl,
			googleBusinessUrl: urls.googleBusinessUrl,
			openingHours,
			social: {
				facebook: urls.facebook,
				instagram: urls.instagram,
				tiktok: urls.tiktok,
				x: urls.x,
				linkedin: urls.linkedin,
				youtube: urls.youtube
			},
			heroImage: hero.url,
			heroImageKey: hero.key,
			heroImageAlt: clean(fd.get('heroImageAlt'), 200),
			aboutImage: about.url,
			aboutImageKey: about.key,
			gaMeasurementId: ga,
			googleSiteVerification: clean(fd.get('googleSiteVerification'), 120).replace(/[^\w-]/g, '')
		});
		await doc.save();
		return { saved: 'Business settings saved. The website is updated.' };
	}),

	password: adminAction(async ({ request, locals, cookies }) => {
		const fd = await request.formData();
		const current = String(fd.get('current') ?? '');
		const next = String(fd.get('next') ?? '');
		const confirm = String(fd.get('confirm') ?? '');
		const admin = await Admin.findById(locals.admin.id);
		if (!admin || !(await verifyPassword(current, admin.passwordHash))) {
			return fail(400, { error: 'Your current password is incorrect.', section: 'password' });
		}
		if (next.length < 12) return fail(400, { error: 'Use at least 12 characters for the new password.', section: 'password' });
		if (next !== confirm) return fail(400, { error: 'The new passwords don’t match.', section: 'password' });

		admin.passwordHash = await hashPassword(next);
		const name = clean(fd.get('name'), 80);
		if (name) admin.name = name;
		const newEmail = clean(fd.get('email'), 160).toLowerCase();
		if (newEmail && newEmail !== admin.email) {
			if (!isEmail(newEmail)) return fail(400, { error: 'Check the new email address.', section: 'password' });
			admin.email = newEmail;
		}
		await admin.save();

		// Sign out every other device, then keep this one signed in.
		await destroyAllSessions(admin._id);
		const { token, expiresAt } = await createSession(admin._id, request.headers.get('user-agent'));
		cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt, !dev));
		return { saved: 'Account updated. Other devices have been signed out.', section: 'password' };
	})
};
