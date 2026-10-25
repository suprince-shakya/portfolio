import type { NextRequest } from 'next/server';

interface Bucket {
	count: number;
	resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
	ok: boolean;
	remaining: number;
	retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
	const now = Date.now();
	const bucket = buckets.get(key);

	if (!bucket || bucket.resetAt <= now) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
	}

	bucket.count += 1;

	if (bucket.count > limit) {
		return {
			ok: false,
			remaining: 0,
			retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
		};
	}

	return { ok: true, remaining: limit - bucket.count, retryAfterSeconds: 0 };
}

export function getClientIp(req: NextRequest): string {
	const forwarded = req.headers.get('x-forwarded-for');
	if (forwarded) {
		return forwarded.split(',')[0]?.trim() || 'unknown';
	}
	return req.headers.get('x-real-ip') ?? 'unknown';
}

if (typeof setInterval !== 'undefined') {
	const cleanup = setInterval(() => {
		const now = Date.now();
		for (const [key, bucket] of buckets) {
			if (bucket.resetAt <= now) buckets.delete(key);
		}
	}, 60_000);
	(cleanup as { unref?: () => void }).unref?.();
}
