import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().trim().email().max(254),
	password: z.string().min(1).max(128),
});

export const messageSchema = z.object({
	name: z.string().trim().min(2).max(100),
	email: z.string().trim().email().max(254),
	subject: z.string().trim().min(2).max(150),
	message: z.string().trim().min(2).max(5000),
});

const optionalUrl = z
	.string()
	.trim()
	.max(2048)
	.refine((value) => value === '' || /^https?:\/\/\S+$/i.test(value), {
		message: 'Must be a valid http(s) URL',
	})
	.optional();

export const projectSchema = z.object({
	title: z.string().trim().min(2).max(120),
	summary: z.string().trim().min(2).max(2000),
	stacks: z.array(z.string().trim().min(1).max(50)).max(30).default([]),
	live_link: optionalUrl,
	code_link: optionalUrl,
});

const optionalLink = z
	.string()
	.trim()
	.max(2048)
	.refine((value) => value === '' || /^https?:\/\/\S+$/i.test(value) || /^\/\S*$/.test(value), {
		message: 'Use a full URL or a path starting with /',
	})
	.default('');

export const siteContentSchema = z.object({
	profile: z.object({
		name: z.string().trim().min(1).max(80),
		role: z.string().trim().min(1).max(80),
		bio: z.string().trim().min(10).max(5000),
		currently: z.string().trim().max(500).default(''),
		location: z.string().trim().min(1).max(120),
		timezone: z.string().trim().min(1).max(40),
		workingSince: z
			.string()
			.trim()
			.regex(/^\d{4}$/, 'Use a four-digit year'),
		email: z.string().trim().email().max(254),
		github: optionalLink,
		linkedin: optionalLink,
		cv: optionalLink,
		facebook: optionalLink,
	}),
	about: z.object({
		headline: z.string().trim().min(4).max(200),
		paragraphs: z.array(z.string().trim().min(1).max(2000)).min(1).max(12),
		facts: z
			.array(
				z.object({
					label: z.string().trim().min(1).max(40),
					value: z.string().trim().min(1).max(200),
				})
			)
			.max(12)
			.default([]),
	}),
});

export const experienceSchema = z.object({
	period: z.string().trim().min(2).max(60),
	title: z.string().trim().min(2).max(120),
	company: z.string().trim().min(1).max(120),
	summary: z.string().trim().min(2).max(500),
	bullets: z.array(z.string().trim().min(1).max(300)).max(12).default([]),
	stack: z.array(z.string().trim().min(1).max(50)).max(30).default([]),
});

export const stackGroupSchema = z.object({
	label: z.string().trim().min(1).max(40),
	items: z.array(z.string().trim().min(1).max(50)).min(1).max(40),
});

export type MessageInput = z.infer<typeof messageSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type SiteContentInput = z.infer<typeof siteContentSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type StackGroupInput = z.infer<typeof stackGroupSchema>;
