import User from '@/models/User';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI: string = process.env.NEXT_PUBLIC_MONGODB_URI as string;

if (!MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

interface MongooseCache {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

let mongooseCache;

// Use a cached connection for performance
const cached: MongooseCache = mongooseCache || {
	conn: null,
	promise: null,
};

async function dbConnect() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
	}
	cached.conn = await cached.promise;
	await seedAdminUser(); // Automatically seed admin
	return cached.conn;
}

async function seedAdminUser() {
	try {
		const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
		if (!existingAdmin) {
			const hashedPassword = await bcrypt.hash('admin123*#', 10);
			await User.create({
				name: 'Admin',
				email: 'admin@gmail.com',
				password: hashedPassword,
			});
			console.log('✅ Admin user seeded: admin@gmail.com');
		}
	} catch (error) {
		console.error('⚠️ Error seeding admin:', error);
	}
}

export default dbConnect;
