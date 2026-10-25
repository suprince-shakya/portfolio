'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import type { StackGroupDTO } from '@/lib/serializers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StacksManagerProps {
	groups: StackGroupDTO[];
	loadError?: boolean;
}

function parseItems(value: string) {
	return value
		.split(/[,\n]/)
		.map((item) => item.trim())
		.filter(Boolean);
}

export default function StacksManager({ groups, loadError = false }: StacksManagerProps) {
	const router = useRouter();
	const formRef = useRef<HTMLDivElement>(null);

	const [editingId, setEditingId] = useState<string | null>(null);
	const [label, setLabel] = useState('');
	const [items, setItems] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	function resetForm() {
		setEditingId(null);
		setLabel('');
		setItems('');
	}

	function startEdit(group: StackGroupDTO) {
		setEditingId(group.id);
		setLabel(group.label);
		setItems(group.items.join(', '));
		setError(null);
		setSuccess(null);
		formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setSuccess(null);

		const parsedItems = parseItems(items);
		if (parsedItems.length === 0) {
			setError('Add at least one item to the group.');
			setIsSubmitting(false);
			return;
		}

		try {
			const response = await fetch(editingId ? `/api/stacks/${editingId}` : '/api/stacks', {
				method: editingId ? 'PUT' : 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ label, items: parsedItems }),
			});
			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(data.error || 'Could not save the stack group');
			}

			resetForm();
			setSuccess(editingId ? 'Stack group updated.' : 'Stack group added.');
			router.refresh();
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : 'Could not save the stack group');
		} finally {
			setIsSubmitting(false);
		}
	}

	async function onDelete(group: StackGroupDTO) {
		if (!window.confirm(`Delete the "${group.label}" stack group?`)) return;

		setDeletingId(group.id);
		setError(null);
		setSuccess(null);

		try {
			const response = await fetch(`/api/stacks/${group.id}`, { method: 'DELETE' });
			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(data.error || 'Could not delete the stack group');
			}

			if (editingId === group.id) resetForm();
			setSuccess('Stack group deleted.');
			router.refresh();
		} catch (deleteError) {
			setError(deleteError instanceof Error ? deleteError.message : 'Could not delete the stack group');
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Stacks</h1>
				<p className="text-muted-foreground">Manage the technology groups shown in the stack section.</p>
			</div>

			{loadError && (
				<p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
					Could not load stacks. Check your database connection.
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
						{editingId ? 'Edit stack group' : 'New stack group'}
					</CardTitle>
					<CardDescription>Items can be separated with commas or new lines.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="label">Group name</Label>
							<Input
								id="label"
								value={label}
								onChange={(event) => setLabel(event.target.value)}
								placeholder="Languages"
								required
								maxLength={40}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="items">Items</Label>
							<Textarea
								id="items"
								value={items}
								onChange={(event) => setItems(event.target.value)}
								rows={4}
								placeholder="TypeScript, JavaScript, SQL"
								required
							/>
						</div>

						<div className="flex flex-wrap gap-2">
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? 'Saving...' : editingId ? 'Update group' : 'Add group'}
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
				<h2 className="text-xl font-semibold">All groups ({groups.length})</h2>

				{groups.length === 0 ? (
					<p className="text-sm text-muted-foreground">No stack groups yet.</p>
				) : (
					<div className="space-y-3">
						{groups.map((group) => (
							<Card key={group.id}>
								<CardContent className="space-y-3 p-4">
									<div className="flex flex-wrap items-start justify-between gap-3">
										<h3 className="font-semibold">{group.label}</h3>
										<div className="flex gap-2">
											<Button variant="outline" size="sm" onClick={() => startEdit(group)}>
												<Pencil className="h-4 w-4" /> Edit
											</Button>
											<Button
												variant="destructive"
												size="sm"
												disabled={deletingId === group.id}
												onClick={() => onDelete(group)}
											>
												<Trash2 className="h-4 w-4" />
												{deletingId === group.id ? 'Deleting...' : 'Delete'}
											</Button>
										</div>
									</div>

									<div className="flex flex-wrap gap-1.5">
										{group.items.map((item) => (
											<span key={item} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
												{item}
											</span>
										))}
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
