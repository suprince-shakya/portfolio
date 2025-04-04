import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Portfolio from '@/models/Portfolio';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import * as fs from 'fs';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	await dbConnect();
	const authHeader = req.headers.get('authorization');
	if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	try {
		verifyToken(authHeader.split(' ')[1]);
		const { id } = await params;
		const portfolio = await Portfolio.findById(id);
		if (!portfolio) {
			return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
		}

		if (portfolio.image) deleteImage(portfolio.image);
		if (portfolio.gallery.length) {
			for (const gal of portfolio.gallery) {
				deleteImage(gal);
			}
		}

		await portfolio.deleteOne();

		return NextResponse.json({ message: 'Portfolio deleted successfully' }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}

// Delete image from disk
const deleteImage = async (filepath: string) => {
	const filePath = path.join(process.cwd(), 'public', filepath);
	fs.unlinkSync(filePath);
};
