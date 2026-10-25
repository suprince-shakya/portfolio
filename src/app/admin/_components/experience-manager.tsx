'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import type { ExperienceDTO } from '@/lib/serializers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ExperienceManagerProps {
	experiences: ExperienceDTO[];
	loadError?: boolean;
}

const emptyForm = {
	period: '',
	title: '',
	company: '',
	summary: '',
	bullets: '',
	stack: '',
};

export default function ExperienceManager({ experiences, loadError = false }: ExperienceManagerProps) {
	const router = useRouter();
	const formRef = useRef<HTMLDivElement>(null);

	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState(emptyForm);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	function updateField(field: keyof typeof emptyForm, value: string) {
		setForm((current) => ({ ...current, [field]: value }));
	}

	function resetForm() {
		setEditingId(null);
		setForm(emptyForm);
	}

	function startEdit(experience: ExperienceDTO) {
		setEditingId(experience.id);
		setForm({
			period: experience.period,
			title: experience.title,
			company: experience.company,
			summary: experience.summary,
			bullets: experience.bullets.join('\n'),
			stack: experience.stack.join(', '),
		});
		setError(null);
		setSuccess(null);
		formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setSuccess(null);

		const payload = {
			period: form.period,
			title: form.title,
			company: form.company,
			summary: form.summary,
			bullets: form.bullets
				.split('\n')
				.map((line) => line.trim())
				.filter(Boolean),
			stack: form.stack
				.split(',')
				.map((item) => item.trim())
				.filter(Boolean),
		};

		try {
			const response = await fetch(editingId ? `/api/experience/${editingId}` : '/api/experience', {
				method: editingId ? 'PUT' : 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(data.error || 'Could not save the experience');
			}

			resetForm();
			setSuccess(editingId ? 'Experience updated.' : 'Experience added.');
			router.refresh();
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : 'Could not save the experience');
		} finally {
			setIsSubmitting(false);
		}
	}

	async function onDelete(experience: ExperienceDTO) {
		if (!window.confirm(`Delete the "${experience.title}" role?`)) return;

		setDeletingId(experience.id);
		setError(null);
		setSuccess(null);

		try {
			const response = await fetch(`/api/experience/${experience.id}`, { method: 'DELETE' });
			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(data.error || 'Could not delete the experience');
			}

			if (editingId === experience.id) resetForm();
			setSuccess('Experience deleted.');
			router.refresh();
		} catch (deleteError) {
			setError(deleteError instanceof Error ? deleteError.message : 'Could not delete the experience');
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Experience</h1>
				<p className="text-muted-foreground">Add, edit, or remove the roles shown in the experience section.</p>
			</div>

			{loadError && (
				<p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
					Could not load experience. Check your database connection.
				</p>
			)}
			{error && (
				<p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
					{error}
				</p>
			)}
			{success && <p className="rounded-md bg-primary/10 px-4 py-3 text-sm text-primary">{success}</p>}

			<Card ref={formRef}>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{editingId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
						{editingId ? 'Edit experience' : 'New experience'}
					</CardTitle>
					<CardDescription>Bullets go one per line; stack items are comma separated.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit} className="space-y-4">
						<div className="grid gap-4 md:grid-cols-3">
							<div className="space-y-2">
								<Label htmlFor="period">Period</Label>
								<Input
									id="period"
									value={form.period}
									onChange={(event) => updateField('period', event.target.value)}
									placeholder="2023 — Present"
									required
									maxLength={60}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="title">Title</Label>
								<Input
									id="title"
									value={form.title}
									onChange={(event) => updateField('title', event.target.value)}
									placeholder="Full Stack Developer"
									required
									maxLength={120}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="company">Company</Label>
								<Input
									id="company"
									value={form.company}
									onChange={(event) => updateField('company', event.target.value)}
									placeholder="Swivt Technology"
									required
									maxLength={120}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="summary">Summary</Label>
							<Input
								id="summary"
								value={form.summary}
								onChange={(event) => updateField('summary', event.target.value)}
								placeholder="Full-stack product work across web and mobile."
								required
								maxLength={500}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="bullets">Bullets</Label>
							<Textarea
								id="bullets"
								value={form.bullets}
								onChange={(event) => updateField('bullets', event.target.value)}
								rows={4}
								placeholder={'Build and ship features end to end.\nReview code and keep releases small.'}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="stack">Stack</Label>
							<Input
								id="stack"
								value={form.stack}
								onChange={(event) => updateField('stack', event.target.value)}
								placeholder="TypeScript, Next.js, Node.js, MongoDB"
							/>
						</div>

						<div className="flex flex-wrap gap-2">
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? 'Saving...' : editingId ? 'Update experience' : 'Add experience'}
							</Button>
							{editingId && (
								<Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
									Cancel
								</Button>
							)}
						</div>
					</form>
				</CardContent>
			</Card>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">All roles ({experiences.length})</h2>

				{experiences.length === 0 ? (
					<p className="text-sm text-muted-foreground">No experience entries yet.</p>
				) : (
					<div className="space-y-3">
						{experiences.map((experience) => (
							<Card key={experience.id}>
								<CardContent className="space-y-3 p-4">
									<div className="flex flex-wrap items-start justify-between gap-3">
										<div>
											<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
												<h3 className="font-semibold">{experience.title}</h3>
												<span className="text-sm text-muted-foreground">{experience.company}</span>
											</div>
											<p className="font-mono text-xs text-muted-foreground">{experience.period}</p>
										</div>
										<div className="flex gap-2">
											<Button variant="outline" size="sm" onClick={() => startEdit(experience)}>
												<Pencil className="h-4 w-4" /> Edit
											</Button>
											<Button
												variant="destructive"
												size="sm"
												disabled={deletingId === experience.id}
												onClick={() => onDelete(experience)}
											>
												<Trash2 className="h-4 w-4" />
												{deletingId === experience.id ? 'Deleting...' : 'Delete'}
											</Button>
										</div>
									</div>

									<p className="text-sm text-muted-foreground">{experience.summary}</p>

									{experience.bullets.length > 0 && (
										<ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
											{experience.bullets.map((bullet) => (
												<li key={bullet}>{bullet}</li>
											))}
										</ul>
									)}

									{experience.stack.length > 0 && (
										<p className="font-mono text-xs text-muted-foreground">{experience.stack.join(' · ')}</p>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
