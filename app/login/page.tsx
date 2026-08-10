import type { Metadata } from 'next';
import AuthPage from '../components/AuthPage';

export const metadata: Metadata = {
  title: 'Accedi',
  description: 'Accedi al tuo account OmniHabit e riprendi la tua streak.'
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
