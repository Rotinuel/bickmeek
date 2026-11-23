import { createHash, randomBytes } from 'node:crypto';
import { Admin, Session } from './models.js';

export const SESSION_COOKIE = 'bm_admin';
const SESSION_DAYS = 7;

const sha256 = (v) => createHash('sha256').update(v).digest('hex');

export async function createSession(adminId, userAgent = '') {
	const token = randomBytes(32).toString('base64url');
	const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
	await Session.create({
		tokenHash: sha256(token),
		admin: adminId,
		userAgent: String(userAgent).slice(0, 300),
		expiresAt
	});
	return { token, expiresAt };
}

/** Returns the signed-in admin (plain object) or null. Validated server-side on every request. */
export async function getSessionAdmin(token) {
	if (!token || typeof token !== 'string' || token.length > 100) return null;
	const session = await Session.findOne({ tokenHash: sha256(token) }).lean();
	if (!session || session.expiresAt < new Date()) return null;
	const admin = await Admin.findById(session.admin).select('name email').lean();
	if (!admin) return null;
	return { id: String(admin._id), name: admin.name, email: admin.email };
}

export async function destroySession(token) {
	if (!token) return;
	await Session.deleteOne({ tokenHash: sha256(token) });
}

export async function destroyAllSessions(adminId) {
	await Session.deleteMany({ admin: adminId });
}

export function sessionCookieOptions(expiresAt, secure) {
	return {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure,
		expires: expiresAt
	};
}
