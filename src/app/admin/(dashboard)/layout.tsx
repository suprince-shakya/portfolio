import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE, verifyToken } from '@/lib/auth';
import AdminNav from '../_components/admin-nav';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
	const token = (await cookies()).get(AUTH_COOKIE)?.value;

	if (!token) {
		redirect('/admin/login');
	}

	try {
		verifyToken(token);
	} catch {
		redirect('/admin/login');
	}

	return (
		<div className="min-h-screen">
			<AdminNav />
			<main className="container mx-auto px-4 py-8">{children}</main>
		</div>
	);
}
