import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_GALLERY_FILES = 10;

const MIME_TO_EXTENSION: Record<string, string> = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp',
	'image/gif': '.gif',
	'image/avif': '.avif',
};

const UPLOADS_ROOT = path.join(process.cwd(), 'public', 'uploads');
const ALLOWED_FOLDER = /^(portfolio(\/gallery)?|profile)$/;

export class UploadError extends Error {}

export function validateImageFile(file: File) {
	if (!MIME_TO_EXTENSION[file.type]) {
		throw new UploadError(`Unsupported file type: ${file.type || 'unknown'}. Allowed: JPEG, PNG, WebP, GIF, AVIF.`);
	}
	if (file.size > MAX_IMAGE_SIZE) {
		throw new UploadError(`File "${file.name}" is too large. Maximum size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB.`);
	}
}

export async function saveImage(file: File, folder: string): Promise<string> {
	if (!ALLOWED_FOLDER.test(folder)) {
		throw new UploadError('Invalid upload folder.');
	}
	validateImageFile(file);

	const extension = MIME_TO_EXTENSION[file.type];
	const uploadPath = path.join(UPLOADS_ROOT, ...folder.split('/'));
	fs.mkdirSync(uploadPath, { recursive: true });

	const fileName = `${Date.now()}-${randomUUID()}${extension}`;
	const filePath = path.join(uploadPath, fileName);
	const buffer = Buffer.from(await file.arrayBuffer());

	fs.writeFileSync(filePath, buffer);

	return `/uploads/${folder}/${fileName}`;
}

export function deleteImage(filepath: string) {
	const relative = filepath.replace(/^\/+/, '');
	const resolved = path.resolve(process.cwd(), 'public', relative);

	if (!resolved.startsWith(UPLOADS_ROOT + path.sep)) {
		return;
	}

	if (fs.existsSync(resolved)) {
		fs.unlinkSync(resolved);
	}
}
