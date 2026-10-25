import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProfile {
	name: string;
	role: string;
	bio: string;
	currently: string;
	photo: string;
	location: string;
	timezone: string;
	workingSince: string;
	email: string;
	github: string;
	linkedin: string;
	cv: string;
	facebook: string;
}

export interface IAboutFact {
	label: string;
	value: string;
}

export interface IAbout {
	headline: string;
	paragraphs: string[];
	facts: IAboutFact[];
}

export interface ISiteContent extends Document {
	key: string;
	profile: IProfile;
	about: IAbout;
	createdAt?: Date;
	updatedAt?: Date;
}

const ProfileSchema = new Schema<IProfile>(
	{
		name: { type: String, required: true },
		role: { type: String, required: true },
		bio: { type: String, required: true },
		currently: { type: String, default: '' },
		photo: { type: String, default: '' },
		location: { type: String, required: true },
		timezone: { type: String, required: true },
		workingSince: { type: String, required: true },
		email: { type: String, required: true },
		github: { type: String, default: '' },
		linkedin: { type: String, default: '' },
		cv: { type: String, default: '' },
		facebook: { type: String, default: '' },
	},
	{ _id: false }
);

const FactSchema = new Schema<IAboutFact>(
	{
		label: { type: String, required: true },
		value: { type: String, required: true },
	},
	{ _id: false }
);

const AboutSchema = new Schema<IAbout>(
	{
		headline: { type: String, required: true },
		paragraphs: [{ type: String }],
		facts: [FactSchema],
	},
	{ _id: false }
);

const SiteContentSchema: Schema<ISiteContent> = new mongoose.Schema(
	{
		key: { type: String, required: true, unique: true, default: 'site' },
		profile: { type: ProfileSchema, required: true },
		about: { type: AboutSchema, required: true },
	},
	{ timestamps: true }
);

const SiteContent: Model<ISiteContent> =
	mongoose.models.SiteContent || mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);

export default SiteContent;
