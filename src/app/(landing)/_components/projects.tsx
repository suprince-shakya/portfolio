import { ArrowUpRight, Images } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { ProjectDTO } from '@/lib/serializers';
import GalleryCarousel from './gallery-carousel';

interface ProjectsProps {
	projects: ProjectDTO[];
	github: string;
}

export default function Projects({ projects, github }: ProjectsProps) {
	return (
		<section className="border-b border-border/80">
			<div className="container py-16 sm:py-20">
				<div className="grid gap-8 md:grid-cols-[9rem_1fr] md:gap-14">
					<h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:sticky md:top-24 md:self-start">
						<span className="text-foreground">03</span> / Projects
					</h2>

					<div>
						{projects.length === 0 ? (
							<p className="max-w-2xl text-[15px] leading-7 text-muted-foreground">
								I&apos;m writing up a few recent projects.
								{github && (
									<>
										{' '}
										In the meantime, most of my public work is on{' '}
										<a
											href={github}
											target="_blank"
											rel="noopener noreferrer"
											className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
										>
											GitHub
										</a>
										.
									</>
								)}
							</p>
						) : (
							<ul className="border-t border-border/80">
								{projects.map((project) => {
									const galleryImages = project.gallery ?? [];

									return (
									<li key={project.id} className="border-b border-border/80">
										<article className="grid gap-4 py-6 sm:grid-cols-[1fr_auto] sm:items-start">
											<div className="flex gap-4">
												{project.image &&
													(galleryImages.length > 0 ? (
														<GalleryCarousel title={project.title} images={galleryImages}>
															<button
																type="button"
																aria-label={`Open ${project.title} gallery`}
																className="relative hidden h-16 w-24 shrink-0 cursor-zoom-in overflow-hidden rounded border border-border sm:block"
															>
																<Image
																	src={project.image}
																	alt={project.title}
																	fill
																	sizes="96px"
																	className="object-cover"
																/>
															</button>
														</GalleryCarousel>
													) : (
														<div className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded border border-border sm:block">
															<Image src={project.image} alt={project.title} fill sizes="96px" className="object-cover" />
														</div>
													))}

												<div>
													<h3 className="text-[15px] font-medium">{project.title}</h3>
													<p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">{project.summary}</p>
													{project.stacks.length > 0 && (
														<p className="mt-2 font-mono text-[11px] text-muted-foreground/80">{project.stacks.join(' · ')}</p>
													)}
												</div>
											</div>

											<div className="flex items-center gap-5 text-sm sm:justify-end sm:pt-0.5">
												{galleryImages.length > 0 && (
													<GalleryCarousel title={project.title} images={galleryImages}>
														<button
															type="button"
															className="inline-flex cursor-zoom-in items-center gap-1 font-medium underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
														>
															<Images className="h-3.5 w-3.5" aria-hidden />
															Gallery
														</button>
													</GalleryCarousel>
												)}
												{project.live_link && (
													<Link
														href={project.live_link}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center gap-1 font-medium underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
													>
														Live
														<ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
													</Link>
												)}
												{project.code_link && (
													<Link
														href={project.code_link}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center gap-1 font-medium underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
													>
														Code
														<ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
													</Link>
												)}
												{!project.live_link && !project.code_link && (
													<span className="font-mono text-[11px] text-muted-foreground">Private</span>
												)}
											</div>
										</article>
									</li>
									);
								})}
							</ul>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
