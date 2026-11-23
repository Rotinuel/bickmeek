import { createHash } from 'node:crypto';
import { RateLimit } from './models.js';

/**
 * Fixed-window rate limit stored in MongoDB, so it holds across serverless instances.
 * Returns { ok, retryAfter } — retryAfter in seconds when blocked.
 */
export async function rateLimit(bucket, identity, { limit, windowSeconds }) {
	const key = `${bucket}:${createHash('sha256').update(String(identity)).digest('hex').slice(0, 32)}`;
	const now = Date.now();
	try {
		const doc = await RateLimit.findOneAndUpdate(
			{ key, expiresAt: { $gt: new Date(now) } },
			{ $inc: { count: 1 } },
			{ new: true }
		).lean();

		if (doc) {
			if (doc.count > limit) {
				return { ok: false, retryAfter: Math.ceil((new Date(doc.expiresAt).getTime() - now) / 1000) };
			}
			return { ok: true };
		}

		// No live window: start a new one (replaces an expired doc if the TTL sweep has not run yet).
		await RateLimit.findOneAndUpdate(
			{ key },
			{ $set: { count: 1, expiresAt: new Date(now + windowSeconds * 1000) } },
			{ upsert: true }
		);
		return { ok: true };
	} catch (err) {
		// Never block real customers because the limiter itself failed.
		console.error('[rate-limit]', err?.message);
		return { ok: true };
	}
}

export async function resetRateLimit(bucket, identity) {
	const key = `${bucket}:${createHash('sha256').update(String(identity)).digest('hex').slice(0, 32)}`;
	await RateLimit.deleteOne({ key }).catch(() => {});
}
