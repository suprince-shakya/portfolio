import dbConnect from '@/lib/dbConnect';
import Portfolio from '@/models/Portfolio';
import { serializeProject, type ProjectDTO } from '@/lib/serializers';
import ProjectsManager from '../../_components/projects-manager';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
	let projects: ProjectDTO[] = [];
	let loadError = false;

	try {
		await dbConnect();
		const docs = await Portfolio.find().sort({ createdAt: -1 });
		projects = docs.map(serializeProject);
	} catch (error) {
		console.error('Error loading projects:', error);
		loadError = true;
	}

	return <ProjectsManager projects={projects} loadError={loadError} />;
}
