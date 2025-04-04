'use client';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Contact() {
	const sectionRef = useRef<HTMLElement>(null);
	const { toast } = useToast();
	const MessageformSchema = z.object({
		name: z.string().min(2, {
			message: 'Name must be at least 2 characters',
		}),
		email: z.string().email({ message: 'Must be a valid email' }),
		subject: z.string().min(2, {
			message: 'Subject must be at least 2 characters',
		}),
		message: z.string().min(2, {
			message: 'Message must be at least 2 characters',
		}),
	});

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

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('animate-fade-in');
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => {
			if (sectionRef.current) {
				observer.unobserve(sectionRef.current);
			}
		};
	}, []);

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
			const data = await res.json();
			form.reset();
			toast({
				title: 'Success',
				description: data.message,
			});
		} catch (e: any) {
			toast({
				title: 'Uh oh! Something went wrong.',
				description: e,
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section ref={sectionRef} className="py-20 opacity-0 transition-opacity duration-1000 ease-in-out">
			<div className="container mx-auto">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold mb-4">Contact Me</h2>
					<div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
					<p className="text-muted-foreground max-w-2xl mx-auto">Feel free to reach out to me for any questions or opportunities</p>
				</div>

				<div className="grid lg:grid-cols-2 gap-12">
					<div className="bg-card p-8 rounded-lg shadow-md border">
						<h3 className="text-xl font-bold mb-6">Get In Touch</h3>
						<div className="space-y-6">
							<div className="flex items-start gap-4">
								<div className="p-3 bg-primary/10 rounded-lg text-primary">
									<MapPin className="h-6 w-6" />
								</div>
								<div>
									<h4 className="font-semibold">Location</h4>
									<p className="text-muted-foreground">ilanani, Patan</p>
								</div>
							</div>
							<div className="flex items-start gap-4">
								<div className="p-3 bg-primary/10 rounded-lg text-primary">
									<Mail className="h-6 w-6" />
								</div>
								<div>
									<h4 className="font-semibold">Email</h4>
									<p className="text-muted-foreground">suprincezzz@gmail.com</p>
								</div>
							</div>
						</div>

						<div className="mt-8">
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.3518213517455!2d85.32163217606166!3d27.67551907620093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19c5f67817b1%3A0xa987ae544a4753eb!2sIlanani%2C%20Lalitpur%2044600!5e0!3m2!1sen!2snp!4v1743654358999!5m2!1sen!2snp"
								width="100%"
								height="200"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								className="rounded-lg"
							></iframe>
						</div>
					</div>

					<div className="bg-card p-8 rounded-lg shadow-md border">
						<h3 className="text-xl font-bold mb-6">Send Me a Message</h3>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
								<div className="grid sm:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Your Name</FormLabel>
												<FormControl>
													<Input placeholder="John Doe" {...field} />
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
												<FormLabel>Your Email</FormLabel>
												<FormControl>
													<Input placeholder="johndoe@example.com" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="space-y-2">
									<FormField
										control={form.control}
										name="subject"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subject</FormLabel>
												<FormControl>
													<Input placeholder="How can I help you?" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="space-y-2">
									<FormField
										control={form.control}
										name="message"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subject</FormLabel>
												<FormControl>
													<Textarea placeholder="Your message here..." {...field} rows={5} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
									{isSubmitting ? 'Sending...' : 'Send Message'}
									<Send className="h-4 w-4" />
								</Button>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</section>
	);
}
