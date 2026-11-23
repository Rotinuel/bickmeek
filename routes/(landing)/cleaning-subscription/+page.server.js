import { getGallery, getPlans, getSeo, getTestimonials } from '$lib/server/data.js';
import { bookingAction } from '$lib/server/bookings.js';

export async function load({ parent }) {
	const [seo, plans, testimonials, gallery, { settings }] = await Promise.all([
		getSeo('cleaning-subscription'),
		getPlans(),
		getTestimonials(3),
		getGallery({ featuredFirst: true, limit: 20 }),
		parent()
	]);
	return {
		seo,
		plans,
		testimonials,
		beforeAfter: gallery.filter((g) => g.mediaType === 'before_after').slice(0, 2),
		waMessage: `Hello ${settings.businessName}, I saw your cleaning plans and I'd like a quote for regular cleaning.`
	};
}

export const actions = { book: bookingAction };
