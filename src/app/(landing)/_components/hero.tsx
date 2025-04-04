'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, Github, Linkedin, Mail, Facebook } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero({ contactRef, aboutRef }: { contactRef: React.RefObject<HTMLDivElement>; aboutRef: React.RefObject<HTMLDivElement> }) {
	const [text, setText] = useState('');
	const [isDeleting, setIsDeleting] = useState(false);
	const [loopNum, setLoopNum] = useState(0);
	const [typingSpeed, setTypingSpeed] = useState(150);

	const titles = ['Full Stack Developer', 'Mobile App Developer', 'Software Engineer'];

	const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
		if (ref.current) {
			ref.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	useEffect(() => {
		const handleTyping = () => {
			const i = loopNum % titles.length;
			const fullText = titles[i];

			setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));

			setTypingSpeed(isDeleting ? 50 : 40);

			if (!isDeleting && text === fullText) {
				setTimeout(() => setIsDeleting(true), 1000);
			} else if (isDeleting && text === '') {
				setIsDeleting(false);
				setLoopNum(loopNum + 1);
			}
		};

		const timer = setTimeout(handleTyping, typingSpeed);
		return () => clearTimeout(timer);
	}, [text, isDeleting, loopNum, typingSpeed, titles]);

	return (
		<section className="min-h-screen flex flex-col justify-center pt-16 pb-8 relative overflow-hidden">
			<div className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern-dark opacity-5 z-0"></div>
			<div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
				<div className="space-y-6 text-center lg:text-left">
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
						Hi, I&apos;m <span className="text-primary">Suprince</span>
					</h1>
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold min-h-[40px]">
						<span className="text-primary">{text}</span>
						<span className="animate-blink">|</span>
					</h2>
					<p className="text-muted-foreground text-lg max-w-xl mx-auto lg:mx-0">
						I build fast, good-looking websites and apps that work great on any device. I focus on making things easy to use, quick to load, and accessible to everyone. Got a cool
						idea? Let&apos;s bring it to life together.
					</p>
					<div className="flex flex-wrap gap-4 justify-center lg:justify-start">
						<Button size="lg" className="gap-2" onClick={() => scrollToSection(contactRef)}>
							<Mail className="h-4 w-4" /> Contact Me
						</Button>

						<Link className="flex items-center border px-4 rounded-sm text-sm" href={`${process.env.NEXT_PUBLIC_APP_URL}/suprince-shakya-cv.pdf`} target="_blank">
							Download CV
						</Link>
					</div>
					<div className="flex gap-4 justify-center lg:justify-start pt-4 items-center">
						<Link aria-label="GitHub" href={`https://github.com/suprince-shakya`} target="_blank">
							<Github className="h-5 w-5" />
						</Link>
						<Link aria-label="GitHub" href={`https://www.linkedin.com/in/suprince-shakya/`} target="_blank">
							<Linkedin className="h-5 w-5" />
						</Link>
						<Link aria-label="GitHub" href={`https://www.facebook.com/profile.php?id=100079720681304`} target="_blank">
							<Facebook className="h-5 w-5" />
						</Link>
					</div>
				</div>
				<div className="flex justify-center">
					<div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border-4 border-primary/20 overflow-hidden animate-float">
						<Image src="/profile.png" alt="John Doe" fill className="object-cover" priority />
					</div>
				</div>
			</div>
			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
				<Button variant="ghost" size="icon" aria-label="Scroll down" onClick={() => scrollToSection(aboutRef)}>
					<ArrowDown className="h-6 w-6" />
				</Button>
			</div>
		</section>
	);
}
