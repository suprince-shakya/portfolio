import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

declare global {
	var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

async function dbConnect() {
	if (!MONGODB_URI) {
		throw new Error('Please define the MONGODB_URI environment variable in .env.local');
	}

	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).catch((error) => {
			cached.promise = null;
			throw error;
		});
	}

	cached.conn = await cached.promise;
	return cached.conn;
}

export default dbConnect;
