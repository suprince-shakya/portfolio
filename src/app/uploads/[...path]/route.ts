import { stat, readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const UPLOADS_ROOT = path.join(process.cwd(), 'public', 'uploads');

const CONTENT_TYPES: Record<string, string> = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.gif': 'image/gif',
	'.avif': 'image/avif',
};

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
	const { path: segments } = await params;
	const resolved = path.resolve(UPLOADS_ROOT, ...segments);

	if (resolved !== UPLOADS_ROOT && !resolved.startsWith(UPLOADS_ROOT + path.sep)) {
		return new NextResponse('Not found', { status: 404 });
	}

	const contentType = CONTENT_TYPES[path.extname(resolved).toLowerCase()];
	if (!contentType) {
		return new NextResponse('Not found', { status: 404 });
	}

	try {
		const info = await stat(resolved);
		if (!info.isFile()) {
			return new NextResponse('Not found', { status: 404 });
		}

		const file = await readFile(resolved);
		return new NextResponse(file, {
			headers: {
				'Content-Type': contentType,
				'Content-Length': String(info.size),
				'Cache-Control': 'public, max-age=31536000, immutable',
			},
		});
	} catch {
		return new NextResponse('Not found', { status: 404 });
	}
}
