// Usage: bun run create-admin -- you@example.com "a long strong password" "Your Name"
// Creates an admin, or resets the password if the email already exists.
import mongoose from 'mongoose';
import { connectDB } from '../lib/server/db.js';
import { Admin } from '../lib/server/models.js';
import { hashPassword } from '../lib/server/password.js';

const [email, password, name = 'Administrator'] = process.argv.slice(2);

if (!email || !password) {
	console.error('Usage: bun run create-admin -- <email> <password> [name]');
	process.exit(1);
}
if (password.length < 12) {
	console.error('Use a password of at least 12 characters.');
	process.exit(1);
}

try {
	await connectDB(process.env.MONGODB_URI);
	const passwordHash = await hashPassword(password);
	const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
	if (existing) {
		existing.passwordHash = passwordHash;
		await existing.save();
		console.log(`Password reset for ${existing.email}`);
	} else {
		await Admin.create({ email, name, passwordHash });
		console.log(`Admin created: ${email}`);
	}
} catch (err) {
	console.error('Failed:', err.message);
	process.exitCode = 1;
} finally {
	await mongoose.disconnect();
}
