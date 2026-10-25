import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import RootProvider from '@/lib/providers/RootProvider';
import { ToastContainer } from 'react-toastify';

const sans = IBM_Plex_Sans({
	variable: '--font-sans',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
});

const mono = IBM_Plex_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
	weight: ['400', '500'],
	display: 'swap',
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
	metadataBase: new URL(appUrl),
	title: {
		default: 'Suprince Shakya — Full-stack engineer',
		template: '%s | Suprince Shakya',
	},
	description:
		'Full-stack developer in Lalitpur, Nepal. I build web and mobile products with TypeScript, Next.js, Node.js, and PostgreSQL.',
	keywords: ['Suprince Shakya', 'Full Stack Developer', 'Next.js', 'React', 'Node.js', 'TypeScript', 'Portfolio', 'Nepal'],
	authors: [{ name: 'Suprince Shakya' }],
	creator: 'Suprince Shakya',
	openGraph: {
		type: 'website',
		url: appUrl,
		siteName: 'Suprince Shakya',
		title: 'Suprince Shakya — Full-stack engineer',
		description:
			'Full-stack developer in Lalitpur, Nepal. I build web and mobile products with TypeScript, Next.js, Node.js, and PostgreSQL.',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Suprince Shakya — Full-stack engineer',
		description: 'Full-stack developer building web and mobile products.',
	},
	robots: {
		index: true,
		follow: true,
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#fbfaf7' },
		{ media: '(prefers-color-scheme: dark)', color: '#141311' },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${sans.variable} ${mono.variable} font-sans antialiased`}>
				<ToastContainer />
				<RootProvider>{children}</RootProvider>
			</body>
		</html>
	);
}
