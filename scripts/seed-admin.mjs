import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!uri) {
	console.error('MONGODB_URI is not set. Add it to .env.local.');
	process.exit(1);
}

if (!email || !password) {
	console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set to create/update the admin user.');
	process.exit(1);
}

if (password.length < 8) {
	console.error('ADMIN_PASSWORD must be at least 8 characters long.');
	process.exit(1);
}

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
	},
	{ timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

try {
	await mongoose.connect(uri);

	const hashedPassword = await bcrypt.hash(password, 12);
	const existing = await User.findOne({ email });

	if (existing) {
		existing.password = hashedPassword;
		existing.name = existing.name || 'Admin';
		await existing.save();
		console.log(`Admin password updated for ${email}`);
	} else {
		await User.create({ name: 'Admin', email, password: hashedPassword });
		console.log(`Admin user created: ${email}`);
	}
} catch (error) {
	console.error('Failed to seed admin user:', error);
	process.exitCode = 1;
} finally {
	await mongoose.disconnect();
}
