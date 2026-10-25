import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/constants';

function base64UrlToBytes(input: string): Uint8Array {
	const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
	const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
	const binary = atob(padded);
	const bytes = new Uint8Array(binary.length);
	for (let index = 0; index < binary.length; index += 1) {
		bytes[index] = binary.charCodeAt(index);
	}
	return bytes;
}

async function isValidToken(token: string): Promise<boolean> {
	const secret = process.env.JWT_SECRET;
	if (!secret) return false;

	const [header, payload, signature] = token.split('.');
	if (!header || !payload || !signature) return false;

	try {
		const key = await crypto.subtle.importKey(
			'raw',
			new TextEncoder().encode(secret),
			{ name: 'HMAC', hash: 'SHA-256' },
			false,
			['verify']
		);

		const valid = await crypto.subtle.verify(
			'HMAC',
			key,
			base64UrlToBytes(signature),
			new TextEncoder().encode(`${header}.${payload}`)
		);

		if (!valid) return false;

		const claims = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as {
			exp?: number;
			userId?: string;
		};

		if (typeof claims.exp === 'number' && claims.exp * 1000 <= Date.now()) return false;
		return typeof claims.userId === 'string';
	} catch {
		return false;
	}
}

export async function middleware(request: NextRequest) {
	if (request.nextUrl.pathname === '/admin/login') {
		return NextResponse.next();
	}

	const token = request.cookies.get(AUTH_COOKIE)?.value;

	if (token && (await isValidToken(token))) {
		return NextResponse.next();
	}

	const loginUrl = new URL('/admin/login', request.url);
	return NextResponse.redirect(loginUrl);
}

export const config = {
	matcher: ['/admin', '/admin/:path*'],
};
