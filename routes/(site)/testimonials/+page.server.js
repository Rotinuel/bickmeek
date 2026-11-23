import { getSeo, getTestimonials } from '$lib/server/data.js';

export async function load() {
	const [seo, testimonials] = await Promise.all([getSeo('testimonials'), getTestimonials()]);
	return { seo, testimonials };
}
