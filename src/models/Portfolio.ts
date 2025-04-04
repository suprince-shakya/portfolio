import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPortfolio extends Document {
	title: string;
	summary: string;
	stacks: string[];
	live_link: string;
	code_link: string;
	image: string;
	gallery: string[];
}

const PortfolioSchema: Schema<IPortfolio> = new mongoose.Schema(
	{
		title: { type: String, required: true },
		summary: { type: String, required: true },
		stacks: [{ type: String }],
		live_link: { type: String },
		code_link: { type: String },
		image: { type: String },
		gallery: [{ type: String }],
	},
	{ timestamps: true }
);

const Portfolio: Model<IPortfolio> = mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);

export default Portfolio;
