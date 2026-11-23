import { env } from '$env/dynamic/private';
import { connectDB } from './db.js';
import { bootstrap } from './bootstrap.js';

let ready = null;

/** Connects once per server instance and makes sure default content exists. */
export function ensureDatabase() {
	if (!ready) {
		ready = (async () => {
			await connectDB(env.MONGODB_URI);
			await bootstrap({
				adminEmail: env.ADMIN_EMAIL,
				adminPassword: env.ADMIN_PASSWORD,
				adminName: env.ADMIN_NAME,
				log: (m) => console.info('[bootstrap]', m)
			});
		})().catch((err) => {
			ready = null;
			throw err;
		});
	}
	return ready;
}
