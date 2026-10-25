'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github, Plus, Trash2 } from 'lucide-react';
import type { ProjectDTO } from '@/lib/serializers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProjectsManagerProps {
	projects: ProjectDTO[];
	loadError?: boolean;
}

export default function ProjectsManager({ projects, loadError = false }: ProjectsManagerProps) {
	const router = useRouter();
	const formRef = useRef<HTMLFormElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);
	const galleryInputRef = useRef<HTMLInputElement>(null);

	const [title, setTitle] = useState('');
	const [summary, setSummary] = useState('');
	const [stacks, setStacks] = useState('');
	const [liveLink, setLiveLink] = useState('');
	const [codeLink, setCodeLink] = useState('');
	const [image, setImage] = useState<File | null>(null);
	const [gallery, setGallery] = useState<File[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	function resetForm() {
		setTitle('');
		setSummary('');
		setStacks('');
		setLiveLink('');
		setCodeLink('');
		setImage(null);
		setGallery([]);
		formRef.current?.reset();
		if (imageInputRef.current) imageInputRef.current.value = '';
		if (galleryInputRef.current) galleryInputRef.current.value = '';
	}

	async function onCreate(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setSuccess(null);

		const formData = new FormData();
		formData.append('title', title);
		formData.append('summary', summary);
		stacks
			.split(',')
			.map((stack) => stack.trim())
			.filter(Boolean)
			.forEach((stack) => formData.append('stacks', stack));
		formData.append('live_link', liveLink);
		formData.append('code_link', codeLink);
		if (image) formData.append('image', image);
		gallery.forEach((file) => formData.append('gallery', file));

		try {
			const response = await fetch('/api/projects', { method: 'POST', body: formData });
			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(data.error || 'Could not create the project');
			}

			resetForm();
			setSuccess('Project created successfully.');
			router.refresh();
		} catch (createError) {
			setError(createError instanceof Error ? createError.message : 'Could not create the project');
		} finally {
			setIsSubmitting(false);
		}
	}

	async function onDelete(project: ProjectDTO) {
		if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;

		setDeletingId(project.id);
		setError(null);
		setSuccess(null);

		try {
			const response = await fetch(`/api/projects/${project.id}`, { method: 'DELETE' });
			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(data.error || 'Could not delete the project');
			}

			setSuccess('Project deleted.');
			router.refresh();
		} catch (deleteError) {
			setError(deleteError instanceof Error ? deleteError.message : 'Could not delete the project');
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<div className="space-y-8">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Projects</h1>
					<p className="text-muted-foreground">Add and remove projects shown on the portfolio.</p>
				</div>
			</div>

			{loadError && (
				<p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
					Could not load projects. Check your database connection.
				</p>
			)}
			{error && (
				<p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
					{error}
				</p>
			)}
			{success && <p className="rounded-md bg-primary/10 px-4 py-3 text-sm text-primary">{success}</p>}

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Plus className="h-5 w-5" /> New project
					</CardTitle>
					<CardDescription>Upload a cover image and up to 10 gallery images (max 5MB each).</CardDescription>
				</CardHeader>
				<CardContent>
					<form ref={formRef} onSubmit={onCreate} className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="title">Title</Label>
								<Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={120} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="stacks">Tech stack (comma separated)</Label>
								<Input
									id="stacks"
									value={stacks}
									onChange={(event) => setStacks(event.target.value)}
									placeholder="Next.js, MongoDB, Tailwind"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="summary">Summary</Label>
							<Textarea
								id="summary"
								value={summary}
								onChange={(event) => setSummary(event.target.value)}
								rows={3}
								required
								maxLength={2000}
							/>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="live">Live link</Label>
								<Input
									id="live"
									type="url"
									value={liveLink}
									onChange={(event) => setLiveLink(event.target.value)}
									placeholder="https://example.com"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="code">Code link</Label>
								<Input
									id="code"
									type="url"
									value={codeLink}
									onChange={(event) => setCodeLink(event.target.value)}
									placeholder="https://github.com/..."
								/>
							</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="image">Cover image</Label>
								<Input
									id="image"
									ref={imageInputRef}
									type="file"
									accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
									onChange={(event) => setImage(event.target.files?.[0] ?? null)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="gallery">Gallery images</Label>
								<Input
									id="gallery"
									ref={galleryInputRef}
									type="file"
									accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
									multiple
									onChange={(event) => setGallery(Array.from(event.target.files ?? []).slice(0, 10))}
								/>
							</div>
						</div>

						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Creating...' : 'Create project'}
						</Button>
					</form>
				</CardContent>
			</Card>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">All projects ({projects.length})</h2>

				{projects.length === 0 ? (
					<p className="text-sm text-muted-foreground">No projects yet. Create your first one above.</p>
				) : (
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{projects.map((project) => (
							<Card key={project.id} className="overflow-hidden">
								<div className="relative h-40 w-full bg-muted">
									{project.image ? (
										<Image src={project.image} alt={project.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
									) : (
										<div className="flex h-full items-center justify-center text-sm text-muted-foreground">No image</div>
									)}
								</div>
								<CardContent className="space-y-3 p-4">
									<div>
										<h3 className="font-semibold">{project.title}</h3>
										<p className="line-clamp-2 text-sm text-muted-foreground">{project.summary}</p>
									</div>
									{project.stacks.length > 0 && (
										<div className="flex flex-wrap gap-1">
											{project.stacks.map((stack) => (
												<span key={stack} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
													{stack}
												</span>
											))}
										</div>
									)}
									<div className="flex flex-wrap items-center gap-2">
										{project.live_link && (
											<Button asChild variant="outline" size="sm">
												<Link href={project.live_link} target="_blank" rel="noopener noreferrer">
													<ExternalLink className="h-4 w-4" /> Live
												</Link>
											</Button>
										)}
										{project.code_link && (
											<Button asChild variant="outline" size="sm">
												<Link href={project.code_link} target="_blank" rel="noopener noreferrer">
													<Github className="h-4 w-4" /> Code
												</Link>
											</Button>
										)}
										<Button
											variant="destructive"
											size="sm"
											className="ml-auto"
											disabled={deletingId === project.id}
											onClick={() => onDelete(project)}
										>
											<Trash2 className="h-4 w-4" />
											{deletingId === project.id ? 'Deleting...' : 'Delete'}
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
