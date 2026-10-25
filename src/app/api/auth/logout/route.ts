import { NextResponse } from 'next/server';
import { AUTH_COOKIE, authCookieOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
	const response = NextResponse.json({ message: 'Logged out successfully' });
	response.cookies.set({
		name: AUTH_COOKIE,
		value: '',
		...authCookieOptions,
		maxAge: 0,
	});
	return response;
}
