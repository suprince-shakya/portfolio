import type { IPortfolio } from '@/models/Portfolio';
import type { IMessage } from '@/models/Message';
import type { IAboutFact, ISiteContent } from '@/models/SiteContent';
import type { IExperience } from '@/models/Experience';
import type { IStackGroup } from '@/models/StackGroup';

export interface ProjectDTO {
	id: string;
	title: string;
	summary: string;
	stacks: string[];
	live_link: string;
	code_link: string;
	image: string;
	gallery: string[];
	createdAt: string;
}

export interface MessageDTO {
	id: string;
	name: string;
	email: string;
	subject: string;
	message: string;
	createdAt: string;
}

export interface ProfileDTO {
	name: string;
	role: string;
	bio: string;
	currently: string;
	photo: string;
	location: string;
	timezone: string;
	workingSince: string;
	email: string;
	github: string;
	linkedin: string;
	cv: string;
	facebook: string;
}

export interface AboutFactDTO {
	label: string;
	value: string;
}

export interface AboutDTO {
	headline: string;
	paragraphs: string[];
	facts: AboutFactDTO[];
}

export interface SiteContentDTO {
	profile: ProfileDTO;
	about: AboutDTO;
}

export interface ExperienceDTO {
	id: string;
	period: string;
	title: string;
	company: string;
	summary: string;
	bullets: string[];
	stack: string[];
}

export interface StackGroupDTO {
	id: string;
	label: string;
	items: string[];
}

function toIso(value?: Date | string) {
	if (!value) return '';
	return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export function serializeProject(doc: IPortfolio): ProjectDTO {
	return {
		id: String(doc._id),
		title: doc.title,
		summary: doc.summary,
		stacks: doc.stacks ?? [],
		live_link: doc.live_link ?? '',
		code_link: doc.code_link ?? '',
		image: doc.image ?? '',
		gallery: doc.gallery ?? [],
		createdAt: toIso(doc.createdAt),
	};
}

export function serializeMessage(doc: IMessage): MessageDTO {
	// Older records stored the subject as an array; normalize them to a string.
	const rawSubject = doc.subject as unknown;
	const subject = Array.isArray(rawSubject) ? rawSubject.join(', ') : String(rawSubject ?? '');

	return {
		id: String(doc._id),
		name: doc.name,
		email: doc.email,
		subject,
		message: doc.message,
		createdAt: toIso(doc.createdAt),
	};
}

export function serializeSiteContent(doc: ISiteContent): SiteContentDTO {
	return {
		profile: {
			name: doc.profile.name,
			role: doc.profile.role,
			bio: doc.profile.bio,
			currently: doc.profile.currently ?? '',
			photo: doc.profile.photo ?? '',
			location: doc.profile.location,
			timezone: doc.profile.timezone,
			workingSince: doc.profile.workingSince,
			email: doc.profile.email,
			github: doc.profile.github ?? '',
			linkedin: doc.profile.linkedin ?? '',
			cv: doc.profile.cv ?? '',
			facebook: doc.profile.facebook ?? '',
		},
		about: {
			headline: doc.about.headline,
			paragraphs: doc.about.paragraphs ?? [],
			facts: (doc.about.facts ?? []).map((fact: IAboutFact) => ({ label: fact.label, value: fact.value })),
		},
	};
}

export function serializeExperience(doc: IExperience): ExperienceDTO {
	return {
		id: String(doc._id),
		period: doc.period,
		title: doc.title,
		company: doc.company,
		summary: doc.summary,
		bullets: doc.bullets ?? [],
		stack: doc.stack ?? [],
	};
}

export function serializeStackGroup(doc: IStackGroup): StackGroupDTO {
	return {
		id: String(doc._id),
		label: doc.label,
		items: doc.items ?? [],
	};
}
