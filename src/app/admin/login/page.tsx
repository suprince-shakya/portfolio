import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE, verifyToken } from '@/lib/auth';
import LoginForm from '../_components/login-form';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
	const token = (await cookies()).get(AUTH_COOKIE)?.value;

	if (token) {
		try {
			verifyToken(token);
			redirect('/admin');
		} catch {
			// Invalid/expired token: show the login form.
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center px-4 py-16">
			<LoginForm />
		</div>
	);
}
