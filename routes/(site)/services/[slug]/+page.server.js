import { error } from '@sveltejs/kit';
import { getPlans, getService, getServices } from '$lib/server/data.js';
import { bookingAction } from '$lib/server/bookings.js';
import { waMessage } from '$lib/whatsapp.js';

export async function load({ params, parent }) {
	const service = await getService(params.slug);
	if (!service) error(404, 'We couldn’t find that service. It may have been renamed.');
	const [all, plans, { settings }] = await Promise.all([getServices(), getPlans(), parent()]);
	return {
		service,
		plans,
		related: all.filter((s) => s.slug !== service.slug).slice(0, 3),
		waMessage: waMessage.service(service.name, settings.businessName),
		seo: {
			title: service.seoTitle || `${service.name} in Minna | BiceMeek Cleaning Services`,
			description: service.seoDescription || service.shortDescription,
			keywords: service.seoKeywords,
			ogImage: service.image || undefined
		}
	};
}

export const actions = { book: bookingAction };
