import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				hostname: '127.0.0.1',
				protocol: 'http',
			},
			{
				hostname: 'localhost',
				protocol: 'http',
			},
			{
				hostname: 'suprinceshakya.com.np',
				protocol: 'https',
			},
		],
	},
};

export default nextConfig;
