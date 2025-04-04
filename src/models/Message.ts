import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
	name: string;
	email: string;
	subject: string;
	message: string;
}

const MessageSchema: Schema<IMessage> = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		subject: [{ type: String, required: true }],
		message: { type: String, required: true },
	},
	{ timestamps: true }
);

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
