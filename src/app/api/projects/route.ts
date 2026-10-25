import { getUserId } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Portfolio from '@/models/Portfolio';
import { NextRequest, NextResponse } from 'next/server';
import { serializeProject } from '@/lib/serializers';
import { projectSchema } from '@/lib/validation';
import { MAX_GALLERY_FILES, UploadError, saveImage, validateImageFile } from '@/lib/uploads';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		await dbConnect();
		const portfolios = await Portfolio.find().sort({ createdAt: -1 });
		return NextResponse.json(
			{ data: portfolios.map(serializeProject), message: 'Projects fetched successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error fetching projects:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	const userId = getUserId(req);
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const limit = rateLimit(`project-create:${getClientIp(req)}`, 20, 10 * 60_000);
	if (!limit.ok) {
		return NextResponse.json(
			{ error: 'Too many requests. Please try again later.' },
			{ status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
		);
	}

	let formData: FormData;
	try {
		formData = await req.formData();
	} catch {
		return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
	}

	const stacks = formData
		.getAll('stacks')
		.flatMap((value) => String(value).split(','))
		.map((value) => value.trim())
		.filter(Boolean);

	const parsed = projectSchema.safeParse({
		title: formData.get('title'),
		summary: formData.get('summary'),
		stacks,
		live_link: (formData.get('live_link') as string) || '',
		code_link: (formData.get('code_link') as string) || '',
	});

	if (!parsed.success) {
		return NextResponse.json(
			{ error: 'Invalid input', issues: parsed.error.flatten().fieldErrors },
			{ status: 400 }
		);
	}

	const imageFile = formData.get('image');
	const galleryFiles = formData.getAll('gallery').filter((file): file is File => file instanceof File && file.size > 0);

	if (galleryFiles.length > MAX_GALLERY_FILES) {
		return NextResponse.json(
			{ error: `You can upload at most ${MAX_GALLERY_FILES} gallery images.` },
			{ status: 400 }
		);
	}

	try {
		const filesToCheck = [imageFile, ...galleryFiles].filter(
			(file): file is File => file instanceof File && file.size > 0
		);
		filesToCheck.forEach(validateImageFile);
	} catch (error) {
		if (error instanceof UploadError) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		throw error;
	}

	try {
		await dbConnect();

		const imageUrl = imageFile instanceof File && imageFile.size > 0 ? await saveImage(imageFile, 'portfolio') : '';
		const galleryUrls = await Promise.all(galleryFiles.map((file) => saveImage(file, 'portfolio/gallery')));

		const portfolio = await Portfolio.create({
			title: parsed.data.title,
			summary: parsed.data.summary,
			stacks: parsed.data.stacks,
			live_link: parsed.data.live_link ?? '',
			code_link: parsed.data.code_link ?? '',
			image: imageUrl,
			gallery: galleryUrls,
		});

		return NextResponse.json(
			{ data: serializeProject(portfolio), message: 'Project created successfully' },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating project:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
