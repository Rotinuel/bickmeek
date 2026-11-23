import { fail } from '@sveltejs/kit';
import { plain } from '$lib/server/db.js';
import { SeoPage, SEO_PAGES, Settings } from '$lib/server/models.js';
import { adminAction, mediaField } from '$lib/server/admin.js';
import { DEFAULT_SEO } from '$lib/server/seed-data.js';
import { clean } from '$lib/server/validate.js';

export async function load() {
	const [docs, settings] = await Promise.all([SeoPage.find().lean(), Settings.findOne({ key: 'site' }).select('defaultOgImage').lean()]);
	const byPage = Object.fromEntries(plain(docs).map((d) => [d.page, d]));
	return {
		pages: SEO_PAGES.map((p) => ({ ...p, ...(DEFAULT_SEO[p.key] || {}), ...(byPage[p.key] || {}), page: p.key })),
		defaultOgImage: settings?.defaultOgImage ?? ''
	};
}

export const actions = {
	page: adminAction(async ({ request }) => {
		const fd = await request.formData();
		const page = clean(fd.get('page'), 40);
		if (!SEO_PAGES.some((p) => p.key === page)) return fail(400, { error: 'Unknown page.' });
		const doc = (await SeoPage.findOne({ page })) ?? new SeoPage({ page });
		const og = await mediaField(fd, 'og', { url: doc.ogImage, key: doc.ogImageKey });
		Object.assign(doc, {
			title: clean(fd.get('title'), 80),
			description: clean(fd.get('description'), 200),
			keywords: clean(fd.get('keywords'), 300),
			ogImage: og.url,
			ogImageKey: og.key
		});
		await doc.save();
		return { saved: `SEO for “${SEO_PAGES.find((p) => p.key === page).label}” saved.`, page };
	}),
	default_og: adminAction(async ({ request }) => {
		const fd = await request.formData();
		const s = await Settings.findOne({ key: 'site' });
		if (!s) return fail(400, { error: 'Settings not found.' });
		const og = await mediaField(fd, 'og', { url: s.defaultOgImage, key: s.defaultOgImageKey });
		s.defaultOgImage = og.url;
		s.defaultOgImageKey = og.key;
		await s.save();
		return { saved: 'Default social sharing image saved.' };
	})
};
