// Usage: bun run seed
// Inserts default services, plans, settings, SEO text and (if ADMIN_EMAIL/ADMIN_PASSWORD are set)
// the first admin account. Existing content is never overwritten. Bun loads .env automatically.
import mongoose from 'mongoose';
import { connectDB } from '../lib/server/db.js';
import { bootstrap } from '../lib/server/bootstrap.js';

try {
	await connectDB(process.env.MONGODB_URI);
	await bootstrap({
		adminEmail: process.env.ADMIN_EMAIL,
		adminPassword: process.env.ADMIN_PASSWORD,
		adminName: process.env.ADMIN_NAME,
		log: (m) => console.log('•', m)
	});
	console.log('Seed complete.');
} catch (err) {
	console.error('Seed failed:', err.message);
	process.exitCode = 1;
} finally {
	await mongoose.disconnect();
}
