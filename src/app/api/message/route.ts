import { getUserId } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import Message from '@/models/Message';
import { serializeMessage } from '@/lib/serializers';
import { messageSchema } from '@/lib/validation';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
	const userId = getUserId(req);
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		await dbConnect();
		const messages = await Message.find().sort({ createdAt: -1 });
		return NextResponse.json(
			{ data: messages.map(serializeMessage), message: 'Messages fetched successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error fetching messages:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	const limit = rateLimit(`message:${getClientIp(req)}`, 5, 10 * 60_000);
	if (!limit.ok) {
		return NextResponse.json(
			{ error: 'Too many messages sent. Please try again later.' },
			{ status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
		);
	}

	let formData: FormData;
	try {
		formData = await req.formData();
	} catch {
		return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
	}

	const parsed = messageSchema.safeParse({
		name: formData.get('name'),
		email: formData.get('email'),
		subject: formData.get('subject'),
		message: formData.get('message'),
	});

	if (!parsed.success) {
		return NextResponse.json(
			{ error: 'Invalid input', issues: parsed.error.flatten().fieldErrors },
			{ status: 400 }
		);
	}

	try {
		await dbConnect();
		const newMessage = await Message.create(parsed.data);
		return NextResponse.json(
			{ data: serializeMessage(newMessage), message: 'Message submitted successfully' },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error saving message:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
