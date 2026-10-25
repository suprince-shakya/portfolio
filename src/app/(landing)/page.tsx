import dbConnect from '@/lib/dbConnect';
import Portfolio from '@/models/Portfolio';
import SiteContent from '@/models/SiteContent';
import Experience from '@/models/Experience';
import StackGroup from '@/models/StackGroup';
import { serializeProject, serializeSiteContent, type ProjectDTO, type SiteContentDTO } from '@/lib/serializers';
import { serializeExperience, type ExperienceDTO } from '@/lib/serializers';
import { serializeStackGroup, type StackGroupDTO } from '@/lib/serializers';
import { defaultSiteContent, defaultExperiences, defaultStackGroups } from '@/lib/default-content';
import { HomePage } from './_components/homepage';

export const dynamic = 'force-dynamic';

export default async function Home() {
	let projects: ProjectDTO[] = [];
	let content: SiteContentDTO = defaultSiteContent;
	let experiences: ExperienceDTO[] = defaultExperiences;
	let stacks: StackGroupDTO[] = defaultStackGroups;

	try {
		await dbConnect();

		const [projectDocs, contentDoc, experienceDocs, stackDocs] = await Promise.all([
			Portfolio.find().sort({ createdAt: -1 }),
			SiteContent.findOne({ key: 'site' }),
			Experience.find().sort({ sortOrder: 1, createdAt: 1 }),
			StackGroup.find().sort({ sortOrder: 1, createdAt: 1 }),
		]);

		projects = projectDocs.map(serializeProject);

		// Once the content document exists, use the database arrays even if they are empty.
		if (contentDoc) {
			content = serializeSiteContent(contentDoc);
			experiences = experienceDocs.map(serializeExperience);
			stacks = stackDocs.map(serializeStackGroup);
		}
	} catch (error) {
		console.error('Error loading portfolio content:', error);
	}

	return <HomePage projects={projects} content={content} experiences={experiences} stacks={stacks} />;
}
