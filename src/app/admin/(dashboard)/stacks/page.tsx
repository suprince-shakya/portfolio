import dbConnect from '@/lib/dbConnect';
import StackGroup from '@/models/StackGroup';
import { serializeStackGroup, type StackGroupDTO } from '@/lib/serializers';
import StacksManager from '../../_components/stacks-manager';

export const dynamic = 'force-dynamic';

export default async function AdminStacksPage() {
	let groups: StackGroupDTO[] = [];
	let loadError = false;

	try {
		await dbConnect();
		const docs = await StackGroup.find().sort({ sortOrder: 1, createdAt: 1 });
		groups = docs.map(serializeStackGroup);
	} catch (error) {
		console.error('Error loading stacks:', error);
		loadError = true;
	}

	return <StacksManager groups={groups} loadError={loadError} />;
}
