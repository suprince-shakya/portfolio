'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
	BriefcaseBusiness,
	ExternalLink,
	FileText,
	FolderKanban,
	Layers,
	LayoutDashboard,
	LogOut,
	Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const links = [
	{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
	{ href: '/admin/content', label: 'Content', icon: FileText },
	{ href: '/admin/experience', label: 'Experience', icon: BriefcaseBusiness },
	{ href: '/admin/stacks', label: 'Stacks', icon: Layers },
	{ href: '/admin/projects', label: 'Projects', icon: FolderKanban },
	{ href: '/admin/messages', label: 'Messages', icon: Mail },
];

export default function AdminNav() {
	const pathname = usePathname();
	const router = useRouter();

	async function logout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		router.replace('/admin/login');
		router.refresh();
	}

	return (
		<header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
			<div className="container mx-auto flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex min-w-0 items-center gap-5">
					<Link href="/admin" className="shrink-0 font-semibold tracking-tight">
						Suprince<span className="text-muted-foreground">.</span>{' '}
						<span className="font-normal text-muted-foreground">admin</span>
					</Link>
					<nav className="flex items-center gap-0.5 overflow-x-auto" aria-label="Admin">
						{links.map((link) => {
							const isActive = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);
							const Icon = link.icon;
							return (
								<Link
									key={link.href}
									href={link.href}
									aria-label={link.label}
									title={link.label}
									className={cn(
										'flex shrink-0 items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
										isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
									)}
								>
									<Icon className="h-4 w-4" />
									<span className="hidden lg:inline">{link.label}</span>
								</Link>
							);
						})}
					</nav>
				</div>
				<div className="flex items-center gap-2">
					<Button asChild variant="ghost" size="sm">
						<Link href="/" target="_blank" rel="noopener noreferrer">
							<ExternalLink className="h-4 w-4" /> View site
						</Link>
					</Button>
					<Button variant="outline" size="sm" onClick={logout}>
						<LogOut className="h-4 w-4" /> Logout
					</Button>
				</div>
			</div>
		</header>
	);
}
