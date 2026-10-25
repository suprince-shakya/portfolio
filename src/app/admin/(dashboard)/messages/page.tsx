import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';
import { serializeMessage, type MessageDTO } from '@/lib/serializers';
import MessagesManager from '../../_components/messages-manager';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
	let messages: MessageDTO[] = [];
	let loadError = false;

	try {
		await dbConnect();
		const docs = await Message.find().sort({ createdAt: -1 });
		messages = docs.map(serializeMessage);
	} catch (error) {
		console.error('Error loading messages:', error);
		loadError = true;
	}

	return <MessagesManager messages={messages} loadError={loadError} />;
}
