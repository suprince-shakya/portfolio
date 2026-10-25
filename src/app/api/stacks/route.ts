import { NextRequest, NextResponse } from 'next/server';

import { getUserId } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { serializeStackGroup } from '@/lib/serializers';
import { stackGroupSchema } from '@/lib/validation';
import StackGroup from '@/models/StackGroup';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		await dbConnect();
		const docs = await StackGroup.find().sort({ sortOrder: 1, createdAt: 1 });
		return NextResponse.json({ data: docs.map(serializeStackGroup), message: 'Stack groups fetched successfully' });
	} catch (error) {
		console.error('Error fetching stack groups:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	const userId = getUserId(req);
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const limit = rateLimit(`stack-create:${getClientIp(req)}`, 30, 10 * 60_000);
	if (!limit.ok) {
		return NextResponse.json(
			{ error: 'Too many requests. Please try again later.' },
			{ status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
		);
	}

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
	}

	const parsed = stackGroupSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: 'Invalid input', issues: parsed.error.flatten().fieldErrors }, { status: 400 });
	}

	try {
		await dbConnect();
		const last = await StackGroup.findOne().sort({ sortOrder: -1 }).select('sortOrder');
		const doc = await StackGroup.create({
			...parsed.data,
			sortOrder: (last?.sortOrder ?? -1) + 1,
		});

		return NextResponse.json({ data: serializeStackGroup(doc), message: 'Stack group created successfully' }, { status: 201 });
	} catch (error) {
		console.error('Error creating stack group:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
