import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import Message, { IMessage } from '@/models/Message';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
	await dbConnect();
	const authHeader = req.headers.get('authorization');
	if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		verifyToken(authHeader.split(' ')[1]);
		const messages: IMessage[] = await Message.find();
		return NextResponse.json({ data: messages, message: 'Messages fetched successfully' }, { status: 200 });
	} catch (error) {
		console.error('Error:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
export async function POST(req: NextRequest) {
	await dbConnect();
	const formData = await req.formData();
	try {
		// ✅ Get form data fields
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const subject = formData.get('subject') as string;
		const message = formData.get('message') as string;

		// ✅ Save to MongoDB
		const newMessage = await Message.create({
			name,
			email,
			subject,
			message,
		});

		return NextResponse.json({ data: newMessage, message: 'Message submitted successfully' }, { status: 201 });
	} catch (error) {
		console.error('Error:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
