import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { AUTH_COOKIE, authCookieOptions, generateToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
	const limit = rateLimit(`login:${getClientIp(req)}`, 5, 60_000);
	if (!limit.ok) {
		return NextResponse.json(
			{ error: 'Too many login attempts. Please try again later.' },
			{ status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
		);
	}

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
	}

	const parsed = loginSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
	}

	try {
		await dbConnect();
	} catch (error) {
		console.error('Login database connection failed:', error);
		return NextResponse.json({ error: 'Database unavailable. Please try again shortly.' }, { status: 503 });
	}

	const email = parsed.data.email.toLowerCase();
	const user = await User.findOne({ email });
	if (!user) {
		return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
	}

	const isValid = await bcrypt.compare(parsed.data.password, user.password);
	if (!isValid) {
		return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
	}

	const token = generateToken(String(user._id));
	const response = NextResponse.json({
		data: { id: String(user._id), name: user.name, email: user.email, token },
		message: 'Login successfully',
	});

	response.cookies.set({ name: AUTH_COOKIE, value: token, ...authCookieOptions });
	return response;
}
