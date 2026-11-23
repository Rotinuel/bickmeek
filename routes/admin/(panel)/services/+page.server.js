import { fail } from '@sveltejs/kit';
import mongoose from 'mongoose';
import { plain } from '$lib/server/db.js';
import { Service } from '$lib/server/models.js';
import { adminAction } from '$lib/server/admin.js';
import { deleteUpload } from '$lib/server/storage.js';
import { clean } from '$lib/server/validate.js';

export async function load() {
	const services = await Service.find().sort({ order: 1, name: 1 }).select('name slug enabled order icon image priceInfo').lean();
	return { services: plain(services) };
}

async function byId(fd) {
	const id = clean(fd.get('id'), 40);
	if (!mongoose.isValidObjectId(id)) return null;
	return Service.findById(id);
}

export const actions = {
	toggle: adminAction(async ({ request }) => {
		const s = await byId(await request.formData());
		if (!s) return fail(404, { error: 'Service not found.' });
		s.enabled = !s.enabled;
		await s.save();
		return { saved: `${s.name} is now ${s.enabled ? 'visible' : 'hidden'} on the website.` };
	}),
	delete: adminAction(async ({ request }) => {
		const s = await byId(await request.formData());
		if (!s) return fail(404, { error: 'Service not found.' });
		if (s.imageKey) await deleteUpload(s.imageKey);
		await s.deleteOne();
		return { saved: `${s.name} was deleted.` };
	})
};
