import Link from 'next/link';

export default function NotFound() {
	return (
		<main className="container flex min-h-[80vh] flex-col justify-center py-24">
			<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">404</p>
			<h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Page not found</h1>
			<p className="mt-3 max-w-md text-[15px] leading-7 text-muted-foreground">
				The page you&apos;re looking for doesn&apos;t exist or has moved somewhere else.
			</p>
			<div className="mt-8 flex items-center gap-6 text-sm font-medium">
				<Link href="/" className="underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">
					Back home
				</Link>
				<Link
					href="/#contact"
					className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
				>
					Report a broken link
				</Link>
			</div>
		</main>
	);
}
