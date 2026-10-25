'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ImagePlus, Save } from 'lucide-react';

import type { SiteContentDTO } from '@/lib/serializers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ContentManagerProps {
	content: SiteContentDTO;
	loadError?: boolean;
}

function splitParagraphs(value: string) {
	return value
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);
}

function parseFacts(value: string) {
	return value
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			const separator = line.indexOf('|');
			if (separator === -1) return null;
			const label = line.slice(0, separator).trim();
			const factValue = line.slice(separator + 1).trim();
			return label && factValue ? { label, value: factValue } : null;
		})
		.filter((fact): fact is { label: string; value: string } => Boolean(fact));
}

export default function ContentManager({ content, loadError = false }: ContentManagerProps) {
	const router = useRouter();
	const photoInputRef = useRef<HTMLInputElement>(null);

	const [name, setName] = useState(content.profile.name);
	const [role, setRole] = useState(content.profile.role);
	const [email, setEmail] = useState(content.profile.email);
	const [location, setLocation] = useState(content.profile.location);
	const [timezone, setTimezone] = useState(content.profile.timezone);
	const [workingSince, setWorkingSince] = useState(content.profile.workingSince);
	const [bio, setBio] = useState(content.profile.bio);
	const [currently, setCurrently] = useState(content.profile.currently);
	const [github, setGithub] = useState(content.profile.github);
	const [linkedin, setLinkedin] = useState(content.profile.linkedin);
	const [cv, setCv] = useState(content.profile.cv);
	const [facebook, setFacebook] = useState(content.profile.facebook);

	const [headline, setHeadline] = useState(content.about.headline);
	const [paragraphs, setParagraphs] = useState(content.about.paragraphs.join('\n\n'));
	const [facts, setFacts] = useState(content.about.facts.map((fact) => `${fact.label} | ${fact.value}`).join('\n'));

	const [photo, setPhoto] = useState<File | null>(null);
	const [removePhoto, setRemovePhoto] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const initials = name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setSuccess(null);

		const aboutParagraphs = splitParagraphs(paragraphs);
		if (aboutParagraphs.length === 0) {
			setError('Add at least one paragraph to the about section.');
			return;
		}

		setIsSubmitting(true);

		const formData = new FormData();
		formData.append(
			'profile',
			JSON.stringify({
				name,
				role,
				email,
				location,
				timezone,
				workingSince,
				bio,
				currently,
				github,
				linkedin,
				cv,
				facebook,
			})
		);
		formData.append('about', JSON.stringify({ headline, paragraphs: aboutParagraphs, facts: parseFacts(facts) }));
		if (photo) formData.append('photo', photo);
		if (removePhoto) formData.append('removePhoto', 'true');

		try {
			const response = await fetch('/api/content', { method: 'PUT', body: formData });
			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(data.error || 'Could not save the content');
			}

			setPhoto(null);
			setRemovePhoto(false);
			if (photoInputRef.current) photoInputRef.current.value = '';
			setSuccess('Content saved.');
			router.refresh();
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : 'Could not save the content');
		} finally {
			setIsSubmitting(false);
		}
	}

	const currentPhoto = removePhoto ? '' : content.profile.photo;

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Content</h1>
				<p className="text-muted-foreground">Edit the hero, profile photo, and about section shown on the portfolio.</p>
			</div>

			{loadError && (
				<p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
					Could not load content from the database. Showing defaults until the connection is restored.
				</p>
			)}
			{error && (
				<p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
					{error}
				</p>
			)}
			{success && <p className="rounded-md bg-primary/10 px-4 py-3 text-sm text-primary">{success}</p>}

			<form onSubmit={onSubmit} className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Profile</CardTitle>
						<CardDescription>The intro, photo, and contact details used across the site.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-5">
						<div className="flex flex-wrap items-start gap-5">
							<div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
								{currentPhoto ? (
									<Image src={currentPhoto} alt="" fill sizes="96px" className="object-cover" />
								) : (
									<span className="flex h-full w-full items-center justify-center font-mono text-lg text-muted-foreground">
										{initials || 'SS'}
									</span>
								)}
							</div>
							<div className="space-y-3">
								<div className="space-y-2">
									<Label htmlFor="photo">Profile photo</Label>
									<Input
										id="photo"
										ref={photoInputRef}
										type="file"
										accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
										onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
									/>
									<p className="text-xs text-muted-foreground">Leave empty to keep the current photo. Max 5MB.</p>
								</div>
								{content.profile.photo && (
									<label className="flex items-center gap-2 text-sm">
										<input
											type="checkbox"
											checked={removePhoto}
											onChange={(event) => setRemovePhoto(event.target.checked)}
											className="h-4 w-4 rounded border-border accent-foreground"
										/>
										Remove current photo
									</label>
								)}
								{photo && (
									<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
										<ImagePlus className="h-3.5 w-3.5" />
										Selected: {photo.name}
									</p>
								)}
							</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input id="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="role">Role</Label>
								<Input id="role" value={role} onChange={(event) => setRole(event.target.value)} required maxLength={80} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Contact email</Label>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									required
									maxLength={254}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="location">Address</Label>
								<Input
									id="location"
									value={location}
									onChange={(event) => setLocation(event.target.value)}
									required
									maxLength={120}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="timezone">Timezone</Label>
								<Input
									id="timezone"
									value={timezone}
									onChange={(event) => setTimezone(event.target.value)}
									required
									maxLength={40}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="workingSince">Working since</Label>
								<Input
									id="workingSince"
									value={workingSince}
									onChange={(event) => setWorkingSince(event.target.value)}
									required
									pattern="\d{4}"
									maxLength={4}
									placeholder="2016"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="bio">Description</Label>
							<Textarea
								id="bio"
								value={bio}
								onChange={(event) => setBio(event.target.value)}
								rows={6}
								required
								maxLength={5000}
							/>
							<p className="text-xs text-muted-foreground">Separate paragraphs with a blank line.</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="currently">Currently</Label>
							<Textarea
								id="currently"
								value={currently}
								onChange={(event) => setCurrently(event.target.value)}
								rows={2}
								maxLength={500}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Links</CardTitle>
						<CardDescription>
							Shown in the intro and contact sections. Leave a field empty to hide that link.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="github">GitHub</Label>
							<Input
								id="github"
								value={github}
								onChange={(event) => setGithub(event.target.value)}
								placeholder="https://github.com/username"
								maxLength={2048}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="linkedin">LinkedIn</Label>
							<Input
								id="linkedin"
								value={linkedin}
								onChange={(event) => setLinkedin(event.target.value)}
								placeholder="https://www.linkedin.com/in/username/"
								maxLength={2048}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="cv">CV</Label>
							<Input
								id="cv"
								value={cv}
								onChange={(event) => setCv(event.target.value)}
								placeholder="/suprince-shakya-cv.pdf"
								maxLength={2048}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="facebook">Facebook</Label>
							<Input
								id="facebook"
								value={facebook}
								onChange={(event) => setFacebook(event.target.value)}
								placeholder="https://www.facebook.com/username"
								maxLength={2048}
							/>
						</div>
						<p className="text-xs text-muted-foreground md:col-span-2">
							Use a full URL, or a site path such as /suprince-shakya-cv.pdf.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>About section</CardTitle>
						<CardDescription>The headline, paragraphs, and detail list under the intro.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="headline">Headline</Label>
							<Input
								id="headline"
								value={headline}
								onChange={(event) => setHeadline(event.target.value)}
								required
								maxLength={200}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="paragraphs">Paragraphs</Label>
							<Textarea
								id="paragraphs"
								value={paragraphs}
								onChange={(event) => setParagraphs(event.target.value)}
								rows={7}
								required
							/>
							<p className="text-xs text-muted-foreground">Separate paragraphs with a blank line.</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="facts">Details</Label>
							<Textarea
								id="facts"
								value={facts}
								onChange={(event) => setFacts(event.target.value)}
								rows={5}
								placeholder={'Focus | Full-stack product work\nBased in | Lalitpur, Nepal'}
							/>
							<p className="text-xs text-muted-foreground">One per line, formatted as Label | Value.</p>
						</div>
					</CardContent>
				</Card>

				<Button type="submit" disabled={isSubmitting} className="gap-2">
					<Save className="h-4 w-4" />
					{isSubmitting ? 'Saving...' : 'Save content'}
				</Button>
			</form>
		</div>
	);
}
