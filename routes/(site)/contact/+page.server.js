import { getSeo } from '$lib/server/data.js';
import { bookingAction } from '$lib/server/bookings.js';

export async function load() {
	return { seo: await getSeo('contact') };
}

export const actions = { book: bookingAction };
