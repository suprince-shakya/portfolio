import type { ExperienceDTO } from '@/lib/serializers';

interface ExperienceProps {
	experiences: ExperienceDTO[];
}

export default function Experience({ experiences }: ExperienceProps) {
	return (
		<section className="border-b border-border/80">
			<div className="container py-16 sm:py-20">
				<div className="grid gap-8 md:grid-cols-[9rem_1fr] md:gap-14">
					<h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:sticky md:top-24 md:self-start">
						<span className="text-foreground">02</span> / Experience
					</h2>

					{experiences.length === 0 ? (
						<p className="border-t border-border/80 pt-7 text-sm text-muted-foreground">No experience entries yet.</p>
					) : (
						<ol className="border-t border-border/80">
							{experiences.map((role) => (
								<li key={role.id} className="border-b border-border/80 py-7">
									<div className="grid gap-3 sm:grid-cols-[8rem_1fr] sm:gap-6">
										<p className="font-mono text-[11px] leading-5 text-muted-foreground">{role.period}</p>

										<div>
											<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
												<h3 className="text-[15px] font-medium">{role.title}</h3>
												<p className="text-sm text-muted-foreground">{role.company}</p>
											</div>

											<p className="mt-1.5 text-sm leading-6 text-muted-foreground">{role.summary}</p>

											{role.bullets.length > 0 && (
												<ul className="mt-3 space-y-1.5">
													{role.bullets.map((bullet) => (
														<li key={bullet} className="flex gap-3 text-sm leading-6 text-muted-foreground">
															<span aria-hidden className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
															<span>{bullet}</span>
														</li>
													))}
												</ul>
											)}

											{role.stack.length > 0 && (
												<p className="mt-3 font-mono text-[11px] text-muted-foreground/80">{role.stack.join(' · ')}</p>
											)}
										</div>
									</div>
								</li>
							))}
						</ol>
					)}
				</div>
			</div>
		</section>
	);
}
