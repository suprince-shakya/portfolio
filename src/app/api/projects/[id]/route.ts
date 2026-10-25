import { getUserId } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Portfolio from '@/models/Portfolio';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { deleteImage } from '@/lib/uploads';

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const userId = getUserId(req);
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = await params;
	if (!mongoose.isValidObjectId(id)) {
		return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
	}

	try {
		await dbConnect();
		const portfolio = await Portfolio.findById(id);
		if (!portfolio) {
			return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
		}

		if (portfolio.image) deleteImage(portfolio.image);
		portfolio.gallery?.forEach((image) => deleteImage(image));

		await portfolio.deleteOne();

		return NextResponse.json({ message: 'Portfolio deleted successfully' }, { status: 200 });
	} catch (error) {
		console.error('Error deleting project:', error);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
