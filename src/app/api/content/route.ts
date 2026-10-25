import { NextRequest, NextResponse } from 'next/server';

import { getUserId } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import { defaultSiteContent } from '@/lib/default-content';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { serializeSiteContent } from '@/lib/serializers';
import { deleteImage, saveImage, UploadError, validateImageFile } from '@/lib/uploads';
import { siteContentSchema } from '@/lib/validation';
import SiteContent from '@/models/SiteContent';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		await dbConnect();
		const doc = await SiteContent.findOne({ key: 'site' });
		return NextResponse.json({
			data: doc ? serializeSiteContent(doc) : defaultSiteContent,
			message: 'Site content fetched successfully',
		});
	} catch (error) {
		console.error('Error fetching site content:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

export async function PUT(req: NextRequest) {
	const userId = getUserId(req);
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const limit = rateLimit(`content-update:${getClientIp(req)}`, 30, 10 * 60_000);
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

	let profile: unknown;
	let about: unknown;
	try {
		profile = JSON.parse(String(formData.get('profile') ?? '{}'));
		about = JSON.parse(String(formData.get('about') ?? '{}'));
	} catch {
		return NextResponse.json({ error: 'Invalid content payload' }, { status: 400 });
	}

	const parsed = siteContentSchema.safeParse({ profile, about });
	if (!parsed.success) {
		return NextResponse.json({ error: 'Invalid input', issues: parsed.error.flatten().fieldErrors }, { status: 400 });
	}

	const photoFile = formData.get('photo');
	if (photoFile instanceof File && photoFile.size > 0) {
		try {
			validateImageFile(photoFile);
		} catch (error) {
			if (error instanceof UploadError) {
				return NextResponse.json({ error: error.message }, { status: 400 });
			}
			throw error;
		}
	}

	const removePhoto = formData.get('removePhoto') === 'true';
	let savedPhoto = '';

	try {
		await dbConnect();

		const existing = await SiteContent.findOne({ key: 'site' });
		let photo = existing?.profile?.photo ?? '';

		if (photoFile instanceof File && photoFile.size > 0) {
			savedPhoto = await saveImage(photoFile, 'profile');
			photo = savedPhoto;
		} else if (removePhoto) {
			photo = '';
		}

		const doc = await SiteContent.findOneAndUpdate(
			{ key: 'site' },
			{
				$set: {
					profile: { ...parsed.data.profile, photo },
					about: parsed.data.about,
				},
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);

		const oldPhoto = existing?.profile?.photo ?? '';
		if (oldPhoto && oldPhoto !== photo) {
			deleteImage(oldPhoto);
		}

		if (!doc) {
			if (savedPhoto) deleteImage(savedPhoto);
			return NextResponse.json({ error: 'Could not save site content' }, { status: 500 });
		}

		return NextResponse.json({ data: serializeSiteContent(doc), message: 'Site content updated successfully' });
	} catch (error) {
		if (savedPhoto) deleteImage(savedPhoto);
		console.error('Error updating site content:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
