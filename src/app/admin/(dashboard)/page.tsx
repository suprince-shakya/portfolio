import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, FileText, FolderKanban, Layers, Mail } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';
import Portfolio from '@/models/Portfolio';
import SiteContent from '@/models/SiteContent';
import Experience from '@/models/Experience';
import StackGroup from '@/models/StackGroup';
import { serializeMessage, type MessageDTO } from '@/lib/serializers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
	let projectCount = 0;
	let messageCount = 0;
	let contentCount = 0;
	let experienceCount = 0;
	let stackCount = 0;
	let recentMessages: MessageDTO[] = [];
	let loadError = false;

	try {
		await dbConnect();
		[projectCount, messageCount, contentCount, experienceCount, stackCount, recentMessages] = await Promise.all([
			Portfolio.countDocuments(),
			Message.countDocuments(),
			SiteContent.countDocuments({ key: 'site' }),
			Experience.countDocuments(),
			StackGroup.countDocuments(),
			Message.find().sort({ createdAt: -1 }).limit(5).then((docs) => docs.map(serializeMessage)),
		]);
	} catch (error) {
		console.error('Error loading dashboard:', error);
		loadError = true;
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">Manage the content shown on your portfolio.</p>
			</div>

			{loadError && (
				<p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
					Could not load dashboard data. Check your database connection.
				</p>
			)}

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Site content</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{contentCount ? 'Live' : 'Defaults'}</div>
						<Button asChild variant="link" className="mt-2 h-auto p-0">
							<Link href="/admin/content">
								Edit profile and about <ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Experience</CardTitle>
						<BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{experienceCount}</div>
						<Button asChild variant="link" className="mt-2 h-auto p-0">
							<Link href="/admin/experience">
								Manage experience <ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Stack groups</CardTitle>
						<Layers className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{stackCount}</div>
						<Button asChild variant="link" className="mt-2 h-auto p-0">
							<Link href="/admin/stacks">
								Manage stacks <ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Projects</CardTitle>
						<FolderKanban className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{projectCount}</div>
						<Button asChild variant="link" className="mt-2 h-auto p-0">
							<Link href="/admin/projects">
								Manage projects <ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Messages</CardTitle>
						<Mail className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{messageCount}</div>
						<Button asChild variant="link" className="mt-2 h-auto p-0">
							<Link href="/admin/messages">
								View messages <ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Recent messages</CardTitle>
					<CardDescription>The latest messages submitted through the contact form.</CardDescription>
				</CardHeader>
				<CardContent>
					{recentMessages.length === 0 ? (
						<p className="text-sm text-muted-foreground">No messages yet.</p>
					) : (
						<ul className="divide-y">
							{recentMessages.map((message) => (
								<li key={message.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
									<div className="flex flex-wrap items-baseline justify-between gap-2">
										<span className="font-medium">{message.subject}</span>
										<span className="text-xs text-muted-foreground">
											{message.createdAt ? new Date(message.createdAt).toLocaleString() : ''}
										</span>
									</div>
									<span className="text-sm text-muted-foreground">
										{message.name} &lt;{message.email}&gt;
									</span>
									<p className="line-clamp-2 text-sm">{message.message}</p>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
