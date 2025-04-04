'use client';

import { useEffect, useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IPortfolio } from '@/models/Portfolio';

export default function Projects({ projects }: { projects: IPortfolio[] }) {
	const sectionRef = useRef<HTMLElement>(null);
	const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

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

		projectRefs.current.forEach((item) => {
			if (item) observer.observe(item);
		});

		return () => {
			if (sectionRef.current) {
				observer.unobserve(sectionRef.current);
			}
			projectRefs.current.forEach((item) => {
				if (item) observer.unobserve(item);
			});
		};
	}, []);

	return (
		<section ref={sectionRef} className="py-20 opacity-0 transition-opacity duration-1000 ease-in-out">
			<div className="container mx-auto">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold mb-4">My Projects</h2>
					<div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Here are some of my recent projects. Each project is a unique piece of development that showcases my skills and passion.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{projects.map((project, index) => (
						<Card
							key={index}
							ref={(el) => (projectRefs.current[index] = el) as any}
							className="overflow-hidden opacity-0 duration-700 delay-100 hover:shadow-lg transform hover:-translate-y-2 transition-transform"
						>
							<div className="relative h-72 w-full overflow-hidden">
								<Image src={project.image} alt={project.title} fill className="object-contain transition-transform duration-500 hover:scale-110" />
							</div>
							<CardContent className="p-6">
								<h3 className="text-xl font-bold mb-2">{project.title}</h3>
								<p className="text-muted-foreground mb-4">{project.summary}</p>
								<div className="flex flex-wrap gap-2 mb-6">
									{project.stacks.map((tech, techIndex) => (
										<Badge key={techIndex} variant="secondary">
											{tech}
										</Badge>
									))}
								</div>
								<div className="flex gap-4">
									{project.live_link && (
										<Button asChild size="sm" className="gap-2">
											<Link href={project.live_link} target="_blank">
												<ExternalLink className="h-4 w-4" /> Live Demo
											</Link>
										</Button>
									)}
									{project.code_link && (
										<Button asChild size="sm" variant="outline" className="gap-2">
											<Link href={project.code_link} target="_blank">
												<Github className="h-4 w-4" /> Code
											</Link>
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
