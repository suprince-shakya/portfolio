import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';
import { getUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const userId = getUserId(req);
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = await params;
	if (!mongoose.isValidObjectId(id)) {
		return NextResponse.json({ error: 'Invalid message id' }, { status: 400 });
	}

	try {
		await dbConnect();
		const deleted = await Message.findByIdAndDelete(id);
		if (!deleted) {
			return NextResponse.json({ error: 'Message not found' }, { status: 404 });
		}
		return NextResponse.json({ message: 'Message deleted successfully' }, { status: 200 });
	} catch (error) {
		console.error('Error deleting message:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
