import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE, TOKEN_TTL_SECONDS } from './constants';

export { AUTH_COOKIE };

function getSecret() {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error('JWT_SECRET is not defined. Add it to your .env.local file.');
	}
	return secret;
}

export function generateToken(userId: string) {
	return jwt.sign({ userId }, getSecret(), { expiresIn: TOKEN_TTL_SECONDS });
}

export function verifyToken(token: string): { userId: string } {
	const payload = jwt.verify(token, getSecret());
	if (typeof payload === 'string' || typeof payload.userId !== 'string') {
		throw new Error('Invalid token');
	}
	return { userId: payload.userId };
}

export function getAuthToken(req: NextRequest): string | null {
	const cookieToken = req.cookies.get(AUTH_COOKIE)?.value;
	if (cookieToken) return cookieToken;

	const authHeader = req.headers.get('authorization');
	if (!authHeader) return null;
	return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
}

export function getUserId(req: NextRequest): string | null {
	try {
		const token = getAuthToken(req);
		if (!token) return null;
		return verifyToken(token).userId;
	} catch {
		return null;
	}
}

const secureCookies =
	process.env.AUTH_COOKIE_SECURE === 'true' ||
	(process.env.AUTH_COOKIE_SECURE !== 'false' && process.env.NODE_ENV === 'production');

export const authCookieOptions = {
	httpOnly: true,
	sameSite: 'lax' as const,
	secure: secureCookies,
	path: '/',
	maxAge: TOKEN_TTL_SECONDS,
};
