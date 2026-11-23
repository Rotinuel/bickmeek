import { getGallery, getPlans, getSeo, getTestimonials } from '$lib/server/data.js';
import { bookingAction } from '$lib/server/bookings.js';

export async function load() {
	const [seo, plans, testimonials, gallery] = await Promise.all([
		getSeo('home'),
		getPlans(),
		getTestimonials(6),
		getGallery({ limit: 12, featuredFirst: true })
	]);
	return {
		seo,
		plans,
		testimonials,
		beforeAfter: gallery.filter((g) => g.mediaType === 'before_after').slice(0, 2),
		galleryPreview: gallery.filter((g) => g.mediaType !== 'before_after').slice(0, 6)
	};
}

export const actions = { book: bookingAction };
