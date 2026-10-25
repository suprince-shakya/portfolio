import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStackGroup extends Document {
	label: string;
	items: string[];
	sortOrder: number;
	createdAt?: Date;
	updatedAt?: Date;
}

const StackGroupSchema: Schema<IStackGroup> = new mongoose.Schema(
	{
		label: { type: String, required: true },
		items: [{ type: String }],
		sortOrder: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

const StackGroup: Model<IStackGroup> =
	mongoose.models.StackGroup || mongoose.model<IStackGroup>('StackGroup', StackGroupSchema);

export default StackGroup;
