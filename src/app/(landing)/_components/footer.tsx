import Link from 'next/link';

import type { ProfileDTO } from '@/lib/serializers';

const links = [
	{ href: '#about', label: 'About' },
	{ href: '#experience', label: 'Experience' },
	{ href: '#projects', label: 'Projects' },
	{ href: '#stack', label: 'Stack' },
	{ href: '#contact', label: 'Contact' },
];

interface FooterProps {
	profile: ProfileDTO;
}

export default function Footer({ profile }: FooterProps) {
	return (
		<footer>
			<div className="container flex flex-col gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
				<p>
					&copy; {new Date().getFullYear()} {profile.name}
				</p>

				<nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
					{links.map((link) => (
						<Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
							{link.label}
						</Link>
					))}
					<a href={`mailto:${profile.email}`} className="transition-colors hover:text-foreground">
						Email
					</a>
				</nav>
			</div>
		</footer>
	);
}
