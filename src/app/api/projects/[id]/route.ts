import { getUserId } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Portfolio from '@/models/Portfolio';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { deleteImage, MAX_GALLERY_FILES, saveImage, UploadError, validateImageFile } from '@/lib/uploads';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { projectSchema } from '@/lib/validation';
import { serializeProject } from '@/lib/serializers';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const userId = getUserId(req);
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const limit = rateLimit(`project-update:${getClientIp(req)}`, 40, 10 * 60_000);
	if (!limit.ok) {
		return NextResponse.json(
			{ error: 'Too many requests. Please try again later.' },
			{ status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
		);
	}

	const { id } = await params;
	if (!mongoose.isValidObjectId(id)) {
		return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });
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
	const removeImage = formData.get('remove_image') === 'true';

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

	let newImageUrl = '';
	const newGalleryUrls: string[] = [];

	try {
		await dbConnect();
		const portfolio = await Portfolio.findById(id);
		if (!portfolio) {
			return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
		}

		const previousImage = portfolio.image ?? '';

		if (imageFile instanceof File && imageFile.size > 0) {
			newImageUrl = await saveImage(imageFile, 'portfolio');
			portfolio.image = newImageUrl;
		} else if (removeImage) {
			portfolio.image = '';
		}

		if (galleryFiles.length > 0) {
			const uploaded = await Promise.all(galleryFiles.map((file) => saveImage(file, 'portfolio/gallery')));
			newGalleryUrls.push(...uploaded);
			portfolio.gallery = [...(portfolio.gallery ?? []), ...uploaded];
		}

		portfolio.title = parsed.data.title;
		portfolio.summary = parsed.data.summary;
		portfolio.stacks = parsed.data.stacks;
		portfolio.live_link = parsed.data.live_link ?? '';
		portfolio.code_link = parsed.data.code_link ?? '';

		await portfolio.save();

		if (previousImage && previousImage !== portfolio.image) {
			deleteImage(previousImage);
		}

		return NextResponse.json({ data: serializeProject(portfolio), message: 'Project updated successfully' });
	} catch (error) {
		[newImageUrl, ...newGalleryUrls].filter(Boolean).forEach(deleteImage);
		console.error('Error updating project:', error);
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
