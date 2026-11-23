import { getPlans, getSeo, getTestimonials } from '$lib/server/data.js';
import { bookingAction } from '$lib/server/bookings.js';

export async function load({ parent }) {
	const [seo, plans, testimonials, { settings }] = await Promise.all([
		getSeo('cleaning-plans'),
		getPlans(),
		getTestimonials(3),
		parent()
	]);
	return {
		seo,
		plans,
		testimonials,
		waMessage: `Hello ${settings.businessName}, I would like to enquire about a regular cleaning plan.`
	};
}

export const actions = { book: bookingAction };
