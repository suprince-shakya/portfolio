import type { StackGroupDTO } from '@/lib/serializers';

interface TechStackProps {
	stacks: StackGroupDTO[];
}

export default function TechStack({ stacks }: TechStackProps) {
	return (
		<section className="border-b border-border/80">
			<div className="container py-16 sm:py-20">
				<div className="grid gap-8 md:grid-cols-[9rem_1fr] md:gap-14">
					<h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:sticky md:top-24 md:self-start">
						<span className="text-foreground">04</span> / Stack
					</h2>

					<div>
						<p className="max-w-2xl text-[15px] leading-7 text-muted-foreground">
							Tools I use regularly. I&apos;d rather know a few well than list everything I&apos;ve touched once.
						</p>

						{stacks.length === 0 ? (
							<p className="mt-8 border-t border-border/80 pt-8 text-sm text-muted-foreground">No stack groups yet.</p>
						) : (
							<dl className="mt-8 grid gap-x-12 gap-y-8 border-t border-border/80 pt-8 sm:grid-cols-2">
								{stacks.map((group) => (
									<div key={group.id}>
										<dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">{group.label}</dt>
										<dd className="mt-3">
											<ul className="space-y-1.5 text-sm leading-6 text-muted-foreground">
												{group.items.map((item) => (
													<li key={item}>{item}</li>
												))}
											</ul>
										</dd>
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
