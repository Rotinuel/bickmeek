import mongoose from 'mongoose';

// User input only ever reaches queries as strings (FormData / URL params pass through
// lib/server/validate.js), so operator injection such as { $gt: '' } is not possible.
mongoose.set('strictQuery', true);

/**
 * Cached connection that survives hot reloads and warm serverless invocations.
 * Pure function of the URI so scripts can use it outside SvelteKit.
 */
const cache = (globalThis.__bicemeekMongo ??= { conn: null, promise: null });

export async function connectDB(uri) {
	if (cache.conn) return cache.conn;
	if (!uri) {
		throw new Error('MONGODB_URI is not set. Copy .env.example to .env and add your connection string.');
	}
	if (!cache.promise) {
		// Atlas strings often end in "/" with no database name, which would put the data in "test".
		const hasDbName = /^mongodb(\+srv)?:\/\/[^/]+\/[^/?]+/.test(uri);
		cache.promise = mongoose
			.connect(uri, {
				...(hasDbName ? {} : { dbName: 'bicemeek' }),
				bufferCommands: false,
				maxPoolSize: 10,
				serverSelectionTimeoutMS: 10000,
				// Use IPv4: on Windows "localhost" can resolve to ::1, which local MongoDB often doesn't listen on.
				family: 4
			})
			.then((m) => m)
			.catch((err) => {
				cache.promise = null;
				const hint = uri.startsWith('mongodb+srv://')
					? 'Check the username/password in MONGODB_URI and that your IP is allowed under Atlas → Network Access.'
					: 'Check that MongoDB is running on this computer and MONGODB_URI is e.g. mongodb://127.0.0.1:27017/bicemeek.';
				throw new Error(`Could not connect to MongoDB: ${err.message}. ${hint}`, { cause: err });
			});
	}
	cache.conn = await cache.promise;
	return cache.conn;
}

/** Converts Mongoose docs (ObjectIds, Dates) into plain JSON-safe objects for page data. */
export function plain(value) {
	return JSON.parse(JSON.stringify(value ?? null));
}
