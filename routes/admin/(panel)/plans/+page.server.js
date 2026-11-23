import { fail } from '@sveltejs/kit';
import { plain } from '$lib/server/db.js';
import { Plan } from '$lib/server/models.js';
import { adminAction } from '$lib/server/admin.js';
import { DEFAULT_PLANS } from '$lib/server/seed-data.js';
import { bool, clean, int, lines, money } from '$lib/server/validate.js';

export async function load() {
	const plans = await Plan.find().sort({ order: 1 }).lean();
	// Make sure all three plans exist even if one was removed from the database by hand.
	const byKey = Object.fromEntries(plans.map((p) => [p.key, p]));
	const all = ['daily', 'weekly', 'monthly'].map((k) => byKey[k] ?? { ...DEFAULT_PLANS.find((p) => p.key === k), _id: null });
	return { plans: plain(all) };
}

export const actions = {
	save: adminAction(async ({ request }) => {
		const fd = await request.formData();
		const key = clean(fd.get('key'), 10);
		if (!['daily', 'weekly', 'monthly'].includes(key)) return fail(400, { error: 'Unknown plan.' });
		const name = clean(fd.get('name'), 80);
		if (!name) return fail(400, { error: 'Give the plan a name.', key });

		const highlighted = bool(fd.get('highlighted'));
		const update = {
			key,
			name,
			tagline: clean(fd.get('tagline'), 160),
			description: clean(fd.get('description'), 1200),
			bestFor: clean(fd.get('bestFor'), 240),
			price: money(fd.get('price')),
			priceUnit: clean(fd.get('priceUnit'), 40),
			priceNote: clean(fd.get('priceNote'), 160),
			inclusions: lines(fd.get('inclusions'), 15, 200),
			highlighted,
			enabled: bool(fd.get('enabled')),
			order: int(fd.get('order'), { min: 0, max: 99, fallback: 1 })
		};
		if (highlighted) await Plan.updateMany({ key: { $ne: key } }, { $set: { highlighted: false } });
		await Plan.findOneAndUpdate({ key }, { $set: update }, { upsert: true, runValidators: true });
		return { saved: `${name} saved.`, key };
	})
};
