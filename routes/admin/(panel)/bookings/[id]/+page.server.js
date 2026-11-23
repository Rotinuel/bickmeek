import { error, redirect } from '@sveltejs/kit';
import mongoose from 'mongoose';
import { plain } from '$lib/server/db.js';
import { Booking, BOOKING_STATUSES } from '$lib/server/models.js';
import { adminAction } from '$lib/server/admin.js';
import { clean, cleanMultiline, dateOnly } from '$lib/server/validate.js';

async function findBooking(id) {
	if (!mongoose.isValidObjectId(id)) error(404, 'Booking not found.');
	const b = await Booking.findById(id);
	if (!b) error(404, 'Booking not found.');
	return b;
}

export async function load({ params }) {
	const b = await findBooking(params.id);
	return { booking: plain(b.toObject()) };
}

export const actions = {
	update: adminAction(async ({ params, request, locals }) => {
		const b = await findBooking(params.id);
		const fd = await request.formData();
		const status = clean(fd.get('status'), 20);
		if (BOOKING_STATUSES.some((s) => s.value === status) && status !== b.status) {
			b.status = status;
			b.statusHistory.push({ status, by: locals.admin.email });
		}
		const scheduled = clean(fd.get('scheduledDate'), 10);
		b.scheduledDate = scheduled ? dateOnly(scheduled) : undefined;
		b.scheduledTime = clean(fd.get('scheduledTime'), 60);
		b.adminNotes = cleanMultiline(fd.get('adminNotes'), 4000);
		await b.save();
		return { saved: 'Booking updated.' };
	}),
	delete: adminAction(async ({ params }) => {
		const b = await findBooking(params.id);
		await b.deleteOne();
		redirect(303, '/admin/bookings');
	})
};
