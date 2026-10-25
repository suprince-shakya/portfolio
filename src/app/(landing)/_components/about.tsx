import type { AboutDTO } from '@/lib/serializers';

interface AboutProps {
	about: AboutDTO;
}

export default function About({ about }: AboutProps) {
	return (
		<section className="border-b border-border/80">
			<div className="container py-16 sm:py-20">
				<div className="grid gap-8 md:grid-cols-[9rem_1fr] md:gap-14">
					<h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:sticky md:top-24 md:self-start">
						<span className="text-foreground">01</span> / About
					</h2>

					<div className="max-w-2xl">
						<p className="text-xl font-medium leading-8 tracking-tight sm:text-2xl">{about.headline}</p>

						<div className="mt-6 space-y-4 text-[15px] leading-7 text-muted-foreground">
							{about.paragraphs.map((paragraph) => (
								<p key={paragraph}>{paragraph}</p>
							))}
						</div>

						{about.facts.length > 0 && (
							<dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-border/80 pt-6 sm:grid-cols-2">
								{about.facts.map((fact) => (
									<div key={fact.label}>
										<dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{fact.label}</dt>
										<dd className="mt-1 text-sm leading-6">{fact.value}</dd>
									</div>
								))}
							</dl>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
