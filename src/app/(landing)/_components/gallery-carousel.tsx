'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import { cn } from '@/lib/utils';

interface GalleryCarouselProps {
	title: string;
	images: string[];
	children: React.ReactNode;
}

export default function GalleryCarousel({ title, images, children }: GalleryCarouselProps) {
	const [open, setOpen] = useState(false);
	const [index, setIndex] = useState(0);
	const count = images.length;

	const goTo = useCallback(
		(next: number) => {
			if (count === 0) return;
			setIndex(((next % count) + count) % count);
		},
		[count]
	);

	useEffect(() => {
		if (!open) return;

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'ArrowLeft') goTo(index - 1);
			if (event.key === 'ArrowRight') goTo(index + 1);
		}

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [open, index, goTo]);

	if (count === 0) return <>{children}</>;

	return (
		<Dialog.Root
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (next) setIndex(0);
			}}
		>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
				<Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
					<div className="flex items-center justify-between gap-4 border-b border-border/80 px-4 py-3">
						<div className="min-w-0">
							<Dialog.Title className="truncate text-sm font-semibold">{title}</Dialog.Title>
							<Dialog.Description className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
								Gallery · {index + 1} / {count}
							</Dialog.Description>
						</div>
						<Dialog.Close className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
							<X className="h-4 w-4" />
							<span className="sr-only">Close gallery</span>
						</Dialog.Close>
					</div>

					<div className="relative flex-1 bg-muted/40">
						<div className="relative aspect-[16/10] max-h-[68vh] w-full">
							<Image
								src={images[index]}
								alt={`${title} — image ${index + 1}`}
								fill
								sizes="(min-width: 1024px) 56rem, 100vw"
								className="object-contain"
								priority
							/>
						</div>

						{count > 1 && (
							<>
								<button
									type="button"
									onClick={() => goTo(index - 1)}
									className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow transition-colors hover:bg-background"
								>
									<ChevronLeft className="h-5 w-5" />
									<span className="sr-only">Previous image</span>
								</button>
								<button
									type="button"
									onClick={() => goTo(index + 1)}
									className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow transition-colors hover:bg-background"
								>
									<ChevronRight className="h-5 w-5" />
									<span className="sr-only">Next image</span>
								</button>
							</>
						)}
					</div>

					{count > 1 && (
						<div className="flex gap-2 overflow-x-auto border-t border-border/80 p-3">
							{images.map((image, imageIndex) => (
								<button
									key={`${image}-${imageIndex}`}
									type="button"
									onClick={() => setIndex(imageIndex)}
									className={cn(
										'relative h-14 w-20 shrink-0 overflow-hidden rounded border transition-opacity',
										imageIndex === index ? 'border-foreground' : 'border-border opacity-60 hover:opacity-100'
									)}
								>
									<Image src={image} alt="" fill sizes="80px" className="object-cover" />
									<span className="sr-only">Go to image {imageIndex + 1}</span>
								</button>
							))}
						</div>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
