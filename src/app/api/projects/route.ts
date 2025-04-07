import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Portfolio, { IPortfolio } from '@/models/Portfolio';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import * as fs from 'fs';

export const dynamic = 'force-dynamic';
export async function GET() {
	await dbConnect();
	const portfolios: IPortfolio[] = await Portfolio.find().sort({ createdAt: 'descending' });
	return NextResponse.json({ data: portfolios, message: 'Projects fetched successfully' }, { status: 200 });
}

export async function POST(req: NextRequest) {
	await dbConnect();
	const formData = await req.formData();
	const authHeader = req.headers.get('authorization');
	if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		verifyToken(authHeader.split(' ')[1]);

		// ✅ Get form data fields
		const title = formData.get('title') as string;
		const summary = formData.get('summary') as string;
		const stacks = formData.getAll('stacks') as string[];
		const live_link = formData.get('live_link') as string;
		const code_link = formData.get('code_link') as string;
		const imageFile = formData.get('image') as File;
		const galleryFiles = formData.getAll('gallery') as File[];

		// ✅ Process image & gallery files
		const imageUrl = imageFile ? await saveImage(imageFile, 'portfolio') : '';
		const galleryUrls = await Promise.all(galleryFiles.map((file) => saveImage(file, 'portfolio/gallery')));

		// ✅ Save to MongoDB
		const portfolio = await Portfolio.create({
			title,
			summary,
			stacks,
			live_link,
			code_link,
			image: imageUrl,
			gallery: galleryUrls,
		});

		return NextResponse.json(portfolio, { status: 201 });
	} catch (error) {
		console.error('Error:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

// ✅ Save image to disk
const saveImage = async (file: File, folder: string) => {
	const buffer = Buffer.from(await file.arrayBuffer());
	const uploadPath = path.join(process.cwd(), 'public', 'uploads', folder);
	if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

	const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.name)}`;
	const filePath = path.join(uploadPath, fileName);
	fs.writeFileSync(filePath, buffer);

	return `/uploads/${folder}/${fileName}`;
};
