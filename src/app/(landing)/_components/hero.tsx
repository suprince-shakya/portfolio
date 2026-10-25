import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

import type { ProfileDTO } from '@/lib/serializers';

interface HeroProps {
	profile: ProfileDTO;
}

export default function Hero({ profile }: HeroProps) {
	const links: { href: string; label: string; external: boolean }[] = [
		{ href: `mailto:${profile.email}`, label: 'Email', external: false },
	];

	if (profile.github) links.push({ href: profile.github, label: 'GitHub', external: true });
	if (profile.linkedin) links.push({ href: profile.linkedin, label: 'LinkedIn', external: true });
	if (profile.cv) links.push({ href: profile.cv, label: 'CV', external: true });

	const paragraphs = profile.bio
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);

	const initials = profile.name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();

	return (
		<section id="home" className="border-b border-border/80">
			<div className="container py-16 sm:py-20 lg:py-24">
				<div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_13rem] md:gap-16">
					<div>
						<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{profile.role}</p>

						<h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>

						<div className="mt-6 max-w-2xl space-y-4 text-[15px] leading-7 text-muted-foreground">
							{paragraphs.map((paragraph) => (
								<p key={paragraph}>{paragraph}</p>
							))}
						</div>

						<div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
							{links.map((link) => (
								<a
									key={link.label}
									href={link.href}
									target={link.external ? '_blank' : undefined}
									rel={link.external ? 'noopener noreferrer' : undefined}
									className="inline-flex items-center gap-1 font-medium underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
								>
									{link.label}
									{link.external && <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />}
								</a>
							))}
						</div>

						{profile.currently && (
							<div className="mt-10 border-t border-border/80 pt-5">
								<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Currently</p>
								<p className="mt-2 max-w-2xl text-sm leading-6">{profile.currently}</p>
							</div>
						)}
					</div>

					<div className="flex items-start gap-6 md:flex-col md:gap-8">
						{profile.photo ? (
							<Image
								src={profile.photo}
								alt={profile.name}
								width={160}
								height={160}
								priority
								className="h-24 w-24 rounded-md border border-border object-cover grayscale md:h-40 md:w-40"
							/>
						) : (
							<div className="flex h-24 w-24 items-center justify-center rounded-md border border-border bg-muted font-mono text-2xl text-muted-foreground md:h-40 md:w-40">
								{initials}
							</div>
						)}
						<dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 font-mono text-[11px] md:grid-cols-1">
							<div>
								<dt className="uppercase tracking-[0.14em] text-muted-foreground">Based in</dt>
								<dd className="mt-1 text-foreground">{profile.location}</dd>
							</div>
							<div>
								<dt className="uppercase tracking-[0.14em] text-muted-foreground">Timezone</dt>
								<dd className="mt-1 text-foreground">{profile.timezone}</dd>
							</div>
							<div>
								<dt className="uppercase tracking-[0.14em] text-muted-foreground">Working since</dt>
								<dd className="mt-1 text-foreground">{profile.workingSince}</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</section>
	);
}
