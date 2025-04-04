'use client';
import { useEffect, useRef, useState } from 'react';
import About from './about';
import Contact from './contact';
import Experience from './experience';
import Footer from './footer';
import Hero from './hero';
import Navbar from './navbar';
import Projects from './projects';
import TechStack from './tech-stack';
import { ArrowUp } from 'lucide-react';
import { IPortfolio } from '@/models/Portfolio';

export const HomePage = ({ projects }: { projects: IPortfolio[] }) => {
	const heroRef = useRef<HTMLDivElement>(null);
	const aboutRef = useRef<HTMLDivElement>(null);
	const experienceRef = useRef<HTMLDivElement>(null);
	const projectsRef = useRef<HTMLDivElement>(null);
	const techStackRef = useRef<HTMLDivElement>(null);
	const contactRef = useRef<HTMLDivElement>(null);
	const [showScrollTop, setShowScrollTop] = useState(false);

	const sections: any = [
		{ name: 'Home', ref: heroRef },
		{ name: 'About', ref: aboutRef },
		{ name: 'Experience', ref: experienceRef },
		{ name: 'Projects', ref: projectsRef },
		{ name: 'Tech Stack', ref: techStackRef },
		{ name: 'Contact', ref: contactRef },
	];

	const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
		if (ref.current) {
			ref.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	useEffect(() => {
		const handleScroll = () => {
			// Show/hide scroll to top button
			if (window.scrollY > 300) {
				setShowScrollTop(true);
			} else {
				setShowScrollTop(false);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<>
			<div className="container">
				<Navbar sections={sections} />
				<main className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div ref={heroRef}>
						<Hero contactRef={contactRef as React.RefObject<HTMLDivElement>} aboutRef={aboutRef as React.RefObject<HTMLDivElement>} />
					</div>
					<div ref={aboutRef}>
						<About />
					</div>
					<div ref={experienceRef}>
						<Experience />
					</div>
					<div ref={projectsRef}>
						<Projects projects={projects} />
					</div>
					<div ref={techStackRef}>
						<TechStack />
					</div>
					<div ref={contactRef}>
						<Contact />
					</div>
				</main>
			</div>
			<Footer />
			{showScrollTop && (
				<button
					onClick={() => scrollToSection(heroRef as React.RefObject<HTMLDivElement>)}
					className="fixed bottom-6 right-6 z-50 p-2 rounded-full bg-primary text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
					aria-label="Scroll to top"
				>
					<ArrowUp className="h-6 w-6" />
				</button>
			)}
		</>
	);
};
