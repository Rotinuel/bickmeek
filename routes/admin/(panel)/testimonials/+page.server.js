import { fail } from '@sveltejs/kit';
import mongoose from 'mongoose';
import { plain } from '$lib/server/db.js';
import { Testimonial } from '$lib/server/models.js';
import { adminAction } from '$lib/server/admin.js';
import { bool, clean, cleanMultiline, int } from '$lib/server/validate.js';

export async function load() {
	const items = await Testimonial.find().sort({ order: 1, createdAt: -1 }).lean();
	return { items: plain(items) };
}

function read(fd) {
	return {
		name: clean(fd.get('name'), 100),
		location: clean(fd.get('location'), 100),
		service: clean(fd.get('service'), 100),
		rating: int(fd.get('rating'), { min: 1, max: 5, fallback: 5 }),
		text: cleanMultiline(fd.get('text'), 1200),
		order: int(fd.get('order'), { min: 0, max: 999, fallback: 0 }),
		published: bool(fd.get('published'))
	};
}

async function byId(fd) {
	const id = clean(fd.get('id'), 40);
	return mongoose.isValidObjectId(id) ? Testimonial.findById(id) : null;
}

export const actions = {
	create: adminAction(async ({ request }) => {
		const v = read(await request.formData());
		if (!v.name || v.text.length < 10) return fail(400, { error: 'Add the customer’s name and their review text.' });
		await Testimonial.create({ ...v, isDemo: false });
		return { saved: v.published ? 'Testimonial added and published.' : 'Testimonial saved as a draft.' };
	}),
	update: adminAction(async ({ request }) => {
		const fd = await request.formData();
		const t = await byId(fd);
		if (!t) return fail(404, { error: 'Testimonial not found.' });
		const v = read(fd);
		if (!v.name || v.text.length < 10) return fail(400, { error: 'Add the customer’s name and their review text.' });
		// Editing a demo entry means the admin has replaced it with real words.
		Object.assign(t, v, { isDemo: bool(fd.get('isDemo')) });
		if (t.isDemo && t.published) return fail(400, { error: 'Demo testimonials can’t be published. Replace the text with a real review and untick “Demo content”.' });
		await t.save();
		return { saved: 'Testimonial updated.' };
	}),
	toggle: adminAction(async ({ request }) => {
		const t = await byId(await request.formData());
		if (!t) return fail(404, { error: 'Testimonial not found.' });
		if (!t.published && t.isDemo) return fail(400, { error: 'Demo testimonials can’t be published. Edit it with a real review first.' });
		t.published = !t.published;
		await t.save();
		return { saved: t.published ? 'Published.' : 'Unpublished.' };
	}),
	delete: adminAction(async ({ request }) => {
		const t = await byId(await request.formData());
		if (!t) return fail(404, { error: 'Testimonial not found.' });
		await t.deleteOne();
		return { saved: 'Testimonial deleted.' };
	})
};
