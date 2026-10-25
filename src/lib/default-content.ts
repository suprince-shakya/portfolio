import raw from './content-defaults.json';
import type { ExperienceDTO, SiteContentDTO, StackGroupDTO } from './serializers';

export const defaultSiteContent: SiteContentDTO = {
	profile: { ...raw.profile },
	about: {
		headline: raw.about.headline,
		paragraphs: [...raw.about.paragraphs],
		facts: raw.about.facts.map((fact) => ({ ...fact })),
	},
};

export const defaultExperiences: ExperienceDTO[] = raw.experiences.map((experience, index) => ({
	id: `default-experience-${index}`,
	period: experience.period,
	title: experience.title,
	company: experience.company,
	summary: experience.summary,
	bullets: [...experience.bullets],
	stack: [...experience.stack],
}));

export const defaultStackGroups: StackGroupDTO[] = raw.stacks.map((group, index) => ({
	id: `default-stack-${index}`,
	label: group.label,
	items: [...group.items],
}));
