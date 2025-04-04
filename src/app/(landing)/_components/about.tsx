'use client';

import { useEffect, useRef } from 'react';
import { Award, Calendar, Code, Lightbulb, User } from 'lucide-react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function About() {
	const sectionRef = useRef<HTMLElement>(null);

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

	return (
		<section ref={sectionRef} className="py-20 opacity-0 transition-opacity duration-1000 ease-in-out">
			<div className="container mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">About Me</h2>
					<div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Here you&apos;ll find more information about me, what I do, and my current skills in terms of programming and technology
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-12">
					<div className="relative">
						<div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
							<Image src="/pic.jpg" alt="Suprince Shakya" width={0} height={0} className="object-cover h-full w-full" />
						</div>
						<div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary/10 rounded-full z-0"></div>
						<div className="absolute -top-6 -left-6 w-40 h-40 bg-primary/10 rounded-full z-0"></div>
					</div>

					<div className="lg:mt-[20%]">
						<Tabs defaultValue="personal" className="w-full">
							<TabsList className="grid w-full grid-cols-3 mb-8">
								<TabsTrigger value="personal" className="gap-2">
									<User className="h-4 w-4" /> Personal
								</TabsTrigger>
								<TabsTrigger value="education" className="gap-2">
									<Award className="h-4 w-4" /> Education
								</TabsTrigger>
								<TabsTrigger value="interests" className="gap-2">
									<Lightbulb className="h-4 w-4" /> Interests
								</TabsTrigger>
							</TabsList>
							<TabsContent value="personal" className="space-y-4">
								<h3 className="text-xl font-semibold">Who am I?</h3>
								<p className="text-muted-foreground">
									Hey! I&apos;m a Full Stack Developer who loves building fast, responsive, and clean web apps. I enjoy turning ideas into real, working products that not only look
									good but also perform smoothly across devices. Whether it&apos;s front-end, back-end or mobile apps, I like keeping things simple, efficient, and user-friendly.
								</p>
								<p className="text-muted-foreground">
									I&apos;m also really into sharing what I&apos;ve learned. I enjoy writing blog posts, making tutorials, and helping out beginners who are just starting their coding
									journey. There&apos;s something super satisfying about seeing someone grow and gain confidence with a little guidance.
								</p>
								<p className="text-muted-foreground">
									I&apos;m open to new opportunities—freelance gigs, full-time roles, or fun collaborations. If you&apos;ve got an idea or a role you think I&apos;d be a good fit
									for, don&apos;t hesitate to reach out. I&apos;m always up for a good challenge and meeting new people!
								</p>
							</TabsContent>
							<TabsContent value="education" className="space-y-4">
								<div className="space-y-4">
									<div className="flex gap-4">
										<Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
										<div>
											<h4 className="font-semibold">Bachelor&apos;s in Computer Science</h4>
											<p className="text-sm text-muted-foreground">2012 - 2016</p>
										</div>
									</div>
									<div className="flex gap-4">
										<Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
										<div>
											<h4 className="font-semibold">+2(Intermediate) | Omega College</h4>
											<p className="text-sm text-muted-foreground">2010 - 2012</p>
										</div>
									</div>
									<div className="flex gap-4">
										<Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
										<div>
											<h4 className="font-semibold">KMC School</h4>
											<p className="text-sm text-muted-foreground">2010</p>
										</div>
									</div>
								</div>
							</TabsContent>
							<TabsContent value="interests" className="space-y-4">
								<p className="text-muted-foreground">
									Apart from being a developer, I&apos;m always up for learning about new tech and staying on top of the latest trends. There&apos;s something exciting about exploring how
									new tools can make development even better and more efficient. Whether it&apos;s diving into a new programming language or trying out a cool framework, I love the
									constant learning that comes with tech.
								</p>
								<p className="text-muted-foreground">
									When I&apos;m not coding, I&apos;m usually diving into sci-fi and fantasy movies or TV shows. I can&apos;t get enough of epic adventures and mind-bending plots. I also enjoy
									gaming with my buddies and playing sports, whether it&apos;s a casual match or something a little more competitive. It&apos;s all about having fun and keeping things
									balanced!
								</p>
								<div className="flex gap-4 pt-2">
									<Code className="h-5 w-5 text-primary" />
									<span>Coding</span>
								</div>
								<div className="flex gap-4">
									<Lightbulb className="h-5 w-5 text-primary" />
									<span>Learning New Technologies</span>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</section>
	);
}
