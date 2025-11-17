import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4">
        <Logo className="h-12 w-auto" />
        <LoginForm />
      </div>
    </main>
  );
}
