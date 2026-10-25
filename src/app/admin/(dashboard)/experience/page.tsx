import dbConnect from '@/lib/dbConnect';
import Experience from '@/models/Experience';
import { serializeExperience, type ExperienceDTO } from '@/lib/serializers';
import ExperienceManager from '../../_components/experience-manager';

export const dynamic = 'force-dynamic';

export default async function AdminExperiencePage() {
	let experiences: ExperienceDTO[] = [];
	let loadError = false;

	try {
		await dbConnect();
		const docs = await Experience.find().sort({ sortOrder: 1, createdAt: 1 });
		experiences = docs.map(serializeExperience);
	} catch (error) {
		console.error('Error loading experience:', error);
		loadError = true;
	}

	return <ExperienceManager experiences={experiences} loadError={loadError} />;
}
