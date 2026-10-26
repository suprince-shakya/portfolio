import { existsSync } from 'node:fs';

// Local runs load .env.local; containers and servers use the process environment.
if (existsSync('.env.local') && typeof process.loadEnvFile === 'function') {
	process.loadEnvFile('.env.local');
}
