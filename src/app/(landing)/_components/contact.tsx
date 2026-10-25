'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { ProfileDTO } from '@/lib/serializers';

const MessageformSchema = z.object({
	name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
	email: z.string().email({ message: 'Must be a valid email' }),
	subject: z.string().min(2, { message: 'Subject must be at least 2 characters' }),
	message: z.string().min(2, { message: 'Message must be at least 2 characters' }),
});

interface ContactProps {
	profile: ProfileDTO;
}

export default function Contact({ profile }: ContactProps) {
	const { toast } = useToast();

	const socials: { href: string; label: string }[] = [];
	if (profile.github) socials.push({ href: profile.github, label: 'GitHub' });
	if (profile.linkedin) socials.push({ href: profile.linkedin, label: 'LinkedIn' });
	if (profile.facebook) socials.push({ href: profile.facebook, label: 'Facebook' });
	if (profile.cv) socials.push({ href: profile.cv, label: 'CV' });

	const form = useForm<z.infer<typeof MessageformSchema>>({
		resolver: zodResolver(MessageformSchema),
		defaultValues: {
			email: '',
			name: '',
			message: '',
			subject: '',
		},
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit = async (data: z.infer<typeof MessageformSchema>) => {
		setIsSubmitting(true);
		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('email', data.email);
		formData.append('subject', data.subject);
		formData.append('message', data.message);

		try {
			const res = await fetch('/api/message', {
				method: 'POST',
				body: formData,
			});
			const data = await res.json().catch(() => ({}));

			if (!res.ok) {
				throw new Error(data.error || 'Could not send your message. Please try again.');
			}

			form.reset();
			toast({
				title: 'Success',
				description: data.message,
			});
		} catch (error) {
			toast({
				title: 'Uh oh! Something went wrong.',
				description: error instanceof Error ? error.message : 'Could not send your message.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="border-b border-border/80">
			<div className="container py-16 sm:py-20">
				<div className="grid gap-8 md:grid-cols-[9rem_1fr] md:gap-14">
					<h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:sticky md:top-24 md:self-start">
						<span className="text-foreground">05</span> / Contact
					</h2>

					<div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
						<div>
							<p className="text-xl font-medium leading-8 tracking-tight sm:text-2xl">Have something you want built?</p>
							<p className="mt-4 max-w-md text-[15px] leading-7 text-muted-foreground">
								The best way to reach me is email. I read everything, and I usually reply within a day.
							</p>

							<a
								href={`mailto:${profile.email}`}
								className="mt-6 inline-block text-[15px] font-medium underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
							>
								{profile.email}
							</a>

							{socials.length > 0 && (
								<div className="mt-8">
									<p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Elsewhere</p>
									<div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
										{socials.map((social) => (
											<a
												key={social.label}
												href={social.href}
												target="_blank"
												rel="noopener noreferrer"
												className="underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
											>
												{social.label}
											</a>
										))}
									</div>
								</div>
							)}

							<div className="mt-8">
								<p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Address</p>
								<p className="mt-2 text-sm">{profile.location}</p>
								<p className="mt-1 font-mono text-[11px] text-muted-foreground">{profile.timezone}</p>
							</div>
						</div>

						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
								<div className="grid gap-4 sm:grid-cols-2">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input placeholder="John Doe" autoComplete="name" className="h-10" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input placeholder="johndoe@example.com" type="email" autoComplete="email" className="h-10" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="subject"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Subject</FormLabel>
											<FormControl>
												<Input placeholder="What do you have in mind?" className="h-10" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="message"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Message</FormLabel>
											<FormControl>
												<Textarea placeholder="A little context, a timeline, and what you need help with." rows={5} className="resize-none" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
									{isSubmitting ? 'Sending...' : 'Send message'}
								</Button>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</section>
	);
}
