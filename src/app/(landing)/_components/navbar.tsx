'use client';

import { useState } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { ProfileDTO } from '@/lib/serializers';

const links = [
	{ href: '#about', label: 'About' },
	{ href: '#experience', label: 'Experience' },
	{ href: '#projects', label: 'Projects' },
	{ href: '#stack', label: 'Stack' },
	{ href: '#contact', label: 'Contact' },
];

interface NavbarProps {
	profile: ProfileDTO;
}

export default function Navbar({ profile }: NavbarProps) {
	const { resolvedTheme, setTheme } = useTheme();
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
			<div className="container flex h-16 items-center justify-between gap-6">
				<Link href="#home" className="text-[15px] font-semibold tracking-tight">
					{profile.name}
				</Link>

				<nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex" aria-label="Main">
					{links.map((link) => (
						<a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
							{link.label}
						</a>
					))}
				</nav>

				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
						aria-label="Toggle theme"
						className="h-9 w-9 text-muted-foreground hover:text-foreground"
					>
						<Sun className="h-4 w-4 dark:hidden" />
						<Moon className="hidden h-4 w-4 dark:block" />
					</Button>

					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild className="md:hidden">
							<Button variant="ghost" size="icon" aria-label="Open menu" className="h-9 w-9">
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-full max-w-xs bg-background p-6 sm:max-w-xs">
							<SheetTitle className="text-sm font-semibold">{profile.name}</SheetTitle>
							<nav className="mt-6 flex flex-col" aria-label="Mobile">
								{links.map((link) => (
									<a
										key={link.href}
										href={link.href}
										onClick={() => setOpen(false)}
										className="border-b border-border/70 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</a>
								))}
							</nav>
							<a
								href={`mailto:${profile.email}`}
								className="mt-auto text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
							>
								{profile.email}
							</a>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
