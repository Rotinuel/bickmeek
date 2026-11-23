import { error, fail, redirect } from '@sveltejs/kit';
import mongoose from 'mongoose';
import { plain } from '$lib/server/db.js';
import { Service } from '$lib/server/models.js';
import { adminAction, mediaField } from '$lib/server/admin.js';
import { SERVICE_ICONS } from '$lib/constants.js';
import { bool, clean, cleanMultiline, int, lines, slugify } from '$lib/server/validate.js';

const EMPTY = {
	name: '',
	slug: '',
	shortDescription: '',
	description: '',
	covers: [],
	idealFor: [],
	benefits: [],
	icon: 'sparkles',
	image: '',
	imageAlt: '',
	priceInfo: '',
	order: 10,
	enabled: true,
	seoTitle: '',
	seoDescription: '',
	seoKeywords: ''
};

export async function load({ params }) {
	if (params.id === 'new') return { service: EMPTY, isNew: true };
	if (!mongoose.isValidObjectId(params.id)) error(404, 'Service not found.');
	const s = await Service.findById(params.id).lean();
	if (!s) error(404, 'Service not found.');
	delete s.imageKey;
	return { service: plain(s), isNew: false };
}

export const actions = {
	save: adminAction(async ({ params, request }) => {
		const fd = await request.formData();
		const isNew = params.id === 'new';
		let doc;
		if (isNew) doc = new Service();
		else {
			if (!mongoose.isValidObjectId(params.id)) return fail(404, { error: 'Service not found.' });
			doc = await Service.findById(params.id);
			if (!doc) return fail(404, { error: 'Service not found.' });
		}

		const name = clean(fd.get('name'), 100);
		if (name.length < 2) return fail(400, { error: 'Give the service a name.' });
		const slug = slugify(fd.get('slug') || name);
		if (!slug) return fail(400, { error: 'Add a web address (slug) using letters and numbers.' });
		const icon = clean(fd.get('icon'), 40);

		const media = await mediaField(fd, 'image', { url: doc.image, key: doc.imageKey });

		Object.assign(doc, {
			name,
			slug,
			shortDescription: clean(fd.get('shortDescription'), 240),
			description: cleanMultiline(fd.get('description'), 4000),
			covers: lines(fd.get('covers'), 20, 200),
			idealFor: lines(fd.get('idealFor'), 12, 200),
			benefits: lines(fd.get('benefits'), 12, 240),
			icon: SERVICE_ICONS.includes(icon) ? icon : 'sparkles',
			image: media.url,
			imageKey: media.key,
			imageAlt: clean(fd.get('imageAlt'), 200),
			priceInfo: clean(fd.get('priceInfo'), 160),
			order: int(fd.get('order'), { min: 0, max: 999, fallback: 10 }),
			enabled: bool(fd.get('enabled')),
			seoTitle: clean(fd.get('seoTitle'), 80),
			seoDescription: clean(fd.get('seoDescription'), 200),
			seoKeywords: clean(fd.get('seoKeywords'), 300)
		});
		await doc.save();
		if (isNew) redirect(303, `/admin/services/${doc._id}?created=1`);
		return { saved: 'Service saved. Changes are live on the website.' };
	})
};
