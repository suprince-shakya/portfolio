import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExperience extends Document {
	period: string;
	title: string;
	company: string;
	summary: string;
	bullets: string[];
	stack: string[];
	sortOrder: number;
	createdAt?: Date;
	updatedAt?: Date;
}

const ExperienceSchema: Schema<IExperience> = new mongoose.Schema(
	{
		period: { type: String, required: true },
		title: { type: String, required: true },
		company: { type: String, required: true },
		summary: { type: String, required: true },
		bullets: [{ type: String }],
		stack: [{ type: String }],
		sortOrder: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

const Experience: Model<IExperience> =
	mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);

export default Experience;
