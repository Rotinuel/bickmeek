import { plain } from '$lib/server/db.js';
import { Booking } from '$lib/server/models.js';

export async function load() {
	const [byStatus, recurring, total, recent, thisWeek] = await Promise.all([
		Booking.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
		Booking.countDocuments({ frequency: { $in: ['daily', 'weekly', 'monthly'] } }),
		Booking.countDocuments(),
		Booking.find().sort({ createdAt: -1 }).limit(8).select('ref fullName phone serviceName frequency status createdAt requestType').lean(),
		Booking.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
	]);
	const counts = Object.fromEntries(byStatus.map((s) => [s._id, s.n]));
	const pending = (counts.contacted || 0) + (counts.quotation_sent || 0);
	return {
		stats: {
			total,
			new: counts.new || 0,
			pending,
			confirmed: (counts.confirmed || 0) + (counts.in_progress || 0),
			completed: counts.completed || 0,
			cancelled: counts.cancelled || 0,
			recurring,
			thisWeek
		},
		recent: plain(recent)
	};
}
