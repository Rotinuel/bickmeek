import { plain } from '$lib/server/db.js';
import { Booking, BOOKING_STATUSES } from '$lib/server/models.js';
import { getServices } from '$lib/server/data.js';
import { clean, escapeRegex, int } from '$lib/server/validate.js';

const PAGE_SIZE = 25;

export async function load({ url }) {
	const q = clean(url.searchParams.get('q'), 80);
	const status = clean(url.searchParams.get('status'), 20);
	const frequency = clean(url.searchParams.get('frequency'), 20);
	const service = clean(url.searchParams.get('service'), 80);
	const type = clean(url.searchParams.get('type'), 10);
	const pageNo = int(url.searchParams.get('page'), { min: 1, max: 10000, fallback: 1 });

	const filter = {};
	if (status === 'pending') filter.status = { $in: ['contacted', 'quotation_sent'] };
	else if (status === 'confirmed') filter.status = { $in: ['confirmed', 'in_progress'] };
	else if (BOOKING_STATUSES.some((s) => s.value === status)) filter.status = status;

	if (frequency === 'recurring') filter.frequency = { $in: ['daily', 'weekly', 'monthly'] };
	else if (['one_time', 'daily', 'weekly', 'monthly'].includes(frequency)) filter.frequency = frequency;

	if (service) filter.serviceSlug = service;
	if (type === 'quote' || type === 'booking') filter.requestType = type;

	if (q) {
		const rx = new RegExp(escapeRegex(q), 'i');
		filter.$or = [{ ref: rx }, { fullName: rx }, { phone: rx }, { email: rx }, { address: rx }, { area: rx }];
	}

	const [items, count, services] = await Promise.all([
		Booking.find(filter)
			.sort({ createdAt: -1 })
			.skip((pageNo - 1) * PAGE_SIZE)
			.limit(PAGE_SIZE)
			.select('ref fullName phone serviceName frequency status createdAt preferredDate preferredTime requestType area')
			.lean(),
		Booking.countDocuments(filter),
		getServices({ includeDisabled: true })
	]);

	return {
		items: plain(items),
		count,
		page: pageNo,
		pages: Math.max(1, Math.ceil(count / PAGE_SIZE)),
		filters: { q, status, frequency, service, type },
		serviceOptions: services.map((s) => ({ slug: s.slug, name: s.name }))
	};
}
