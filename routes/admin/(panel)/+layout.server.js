import { Booking } from '$lib/server/models.js';
import { requireAdmin } from '$lib/server/admin.js';

export async function load({ locals, depends }) {
	depends('admin:counts');
	const admin = requireAdmin(locals);
	const newCount = await Booking.countDocuments({ status: 'new' });
	return { admin, newCount };
}
