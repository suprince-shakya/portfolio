'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(data.error || 'Login failed');
			}

			router.replace('/admin');
			router.refresh();
		} catch (loginError) {
			setError(loginError instanceof Error ? loginError.message : 'Login failed');
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="space-y-2 text-center">
				<div className="mx-auto flex h-11 w-11 items-center justify-center rounded-md border border-border bg-muted">
					<LockKeyhole className="h-5 w-5" />
				</div>
				<CardTitle className="text-2xl">Admin Login</CardTitle>
				<CardDescription>Sign in to manage projects and messages.</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							autoComplete="username"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							autoComplete="current-password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							required
						/>
					</div>
					{error && (
						<p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
							{error}
						</p>
					)}
					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? 'Signing in...' : 'Sign in'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
