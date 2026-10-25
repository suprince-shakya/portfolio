'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Trash2 } from 'lucide-react';
import type { MessageDTO } from '@/lib/serializers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MessagesManagerProps {
	messages: MessageDTO[];
	loadError?: boolean;
}

export default function MessagesManager({ messages, loadError = false }: MessagesManagerProps) {
	const router = useRouter();
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function onDelete(message: MessageDTO) {
		if (!window.confirm(`Delete the message from ${message.name}?`)) return;

		setDeletingId(message.id);
		setError(null);

		try {
			const response = await fetch(`/api/message/${message.id}`, { method: 'DELETE' });
			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(data.error || 'Could not delete the message');
			}

			router.refresh();
		} catch (deleteError) {
			setError(deleteError instanceof Error ? deleteError.message : 'Could not delete the message');
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Messages</h1>
				<p className="text-muted-foreground">Messages submitted through the contact form.</p>
			</div>

			{loadError && (
				<p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
					Could not load messages. Check your database connection.
				</p>
			)}
			{error && (
				<p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
					{error}
				</p>
			)}

			{messages.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center text-sm text-muted-foreground">No messages yet.</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{messages.map((message) => (
						<Card key={message.id}>
							<CardHeader className="pb-3">
								<div className="flex flex-wrap items-start justify-between gap-2">
									<div>
										<CardTitle className="text-lg">{message.subject}</CardTitle>
										<p className="text-sm text-muted-foreground">
											{message.name} &lt;
											<a href={`mailto:${message.email}`} className="underline underline-offset-2">
												{message.email}
											</a>
											&gt;
										</p>
									</div>
									<span className="text-xs text-muted-foreground">
										{message.createdAt ? new Date(message.createdAt).toLocaleString() : ''}
									</span>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="whitespace-pre-wrap text-sm">{message.message}</p>
								<div className="flex gap-2">
									<Button asChild variant="outline" size="sm">
										<a href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}>
											<Mail className="h-4 w-4" /> Reply
										</a>
									</Button>
									<Button
										variant="destructive"
										size="sm"
										disabled={deletingId === message.id}
										onClick={() => onDelete(message)}
									>
										<Trash2 className="h-4 w-4" />
										{deletingId === message.id ? 'Deleting...' : 'Delete'}
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
