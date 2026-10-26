import './load-env.mjs';
import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
	console.error('MONGODB_URI is not set. Add it to .env.local or the runtime environment.');
	process.exit(1);
}

const defaults = JSON.parse(await readFile(new URL('../src/lib/content-defaults.json', import.meta.url), 'utf8'));

const profileSchema = new mongoose.Schema(
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

const factSchema = new mongoose.Schema(
	{
		label: { type: String, required: true },
		value: { type: String, required: true },
	},
	{ _id: false }
);

const aboutSchema = new mongoose.Schema(
	{
		headline: { type: String, required: true },
		paragraphs: [{ type: String }],
		facts: [factSchema],
	},
	{ _id: false }
);

const siteContentSchema = new mongoose.Schema(
	{
		key: { type: String, required: true, unique: true, default: 'site' },
		profile: { type: profileSchema, required: true },
		about: { type: aboutSchema, required: true },
	},
	{ timestamps: true }
);

const experienceSchema = new mongoose.Schema(
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

const stackGroupSchema = new mongoose.Schema(
	{
		label: { type: String, required: true },
		items: [{ type: String }],
		sortOrder: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', siteContentSchema);
const Experience = mongoose.models.Experience || mongoose.model('Experience', experienceSchema);
const StackGroup = mongoose.models.StackGroup || mongoose.model('StackGroup', stackGroupSchema);

try {
	await mongoose.connect(uri);

	const existingContent = await SiteContent.collection.findOne({ key: 'site' });

	if (!existingContent) {
		await SiteContent.create({ key: 'site', profile: defaults.profile, about: defaults.about });
		console.log('Seeded profile and about content.');
	} else {
		const linkFields = ['github', 'linkedin', 'cv', 'facebook'];
		const missingLinks = {};

		for (const field of linkFields) {
			if (existingContent.profile?.[field] === undefined) {
				missingLinks[`profile.${field}`] = defaults.profile[field];
			}
		}

		if (Object.keys(missingLinks).length > 0) {
			await SiteContent.updateOne({ key: 'site' }, { $set: missingLinks });
			console.log(`Backfilled ${Object.keys(missingLinks).length} profile link fields.`);
		} else {
			console.log('Profile and about content already exists; leaving it unchanged.');
		}
	}

	if ((await Experience.countDocuments()) === 0) {
		await Experience.insertMany(
			defaults.experiences.map((experience, index) => ({ ...experience, sortOrder: index }))
		);
		console.log(`Seeded ${defaults.experiences.length} experience entries.`);
	} else {
		console.log('Experience already exists; leaving it unchanged.');
	}

	if ((await StackGroup.countDocuments()) === 0) {
		await StackGroup.insertMany(defaults.stacks.map((group, index) => ({ ...group, sortOrder: index })));
		console.log(`Seeded ${defaults.stacks.length} stack groups.`);
	} else {
		console.log('Stacks already exist; leaving them unchanged.');
	}
} catch (error) {
	console.error('Failed to seed content:', error);
	process.exitCode = 1;
} finally {
	await mongoose.disconnect();
}
