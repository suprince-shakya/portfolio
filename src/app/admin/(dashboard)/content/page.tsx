import dbConnect from '@/lib/dbConnect';
import SiteContent from '@/models/SiteContent';
import { serializeSiteContent, type SiteContentDTO } from '@/lib/serializers';
import { defaultSiteContent } from '@/lib/default-content';
import ContentManager from '../../_components/content-manager';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
	let content: SiteContentDTO = defaultSiteContent;
	let loadError = false;

	try {
		await dbConnect();
		const doc = await SiteContent.findOne({ key: 'site' });
		if (doc) {
			content = serializeSiteContent(doc);
		}
	} catch (error) {
		console.error('Error loading site content:', error);
		loadError = true;
	}

	return <ContentManager content={content} loadError={loadError} />;
}
