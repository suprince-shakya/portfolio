import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { getUserId } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { serializeStackGroup } from '@/lib/serializers';
import { stackGroupSchema } from '@/lib/validation';
import StackGroup from '@/models/StackGroup';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const userId = getUserId(req);
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const limit = rateLimit(`stack-update:${getClientIp(req)}`, 40, 10 * 60_000);
	if (!limit.ok) {
		return NextResponse.json(
			{ error: 'Too many requests. Please try again later.' },
			{ status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
		);
	}

	const { id } = await params;
	if (!mongoose.isValidObjectId(id)) {
		return NextResponse.json({ error: 'Invalid stack group id' }, { status: 400 });
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
		const doc = await StackGroup.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
		if (!doc) {
			return NextResponse.json({ error: 'Stack group not found' }, { status: 404 });
		}

		return NextResponse.json({ data: serializeStackGroup(doc), message: 'Stack group updated successfully' });
	} catch (error) {
		console.error('Error updating stack group:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const userId = getUserId(req);
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = await params;
	if (!mongoose.isValidObjectId(id)) {
		return NextResponse.json({ error: 'Invalid stack group id' }, { status: 400 });
	}

	try {
		await dbConnect();
		const doc = await StackGroup.findByIdAndDelete(id);
		if (!doc) {
			return NextResponse.json({ error: 'Stack group not found' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Stack group deleted successfully' });
	} catch (error) {
		console.error('Error deleting stack group:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
