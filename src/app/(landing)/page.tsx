import { HomePage } from './_components/homepage';

export const dynamic = 'force-dynamic';
export default async function Home() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects`, {
		method: 'GET',
	});
	const data = await res.json();
	const projects = data.data;
	return <HomePage projects={projects} />;
}
