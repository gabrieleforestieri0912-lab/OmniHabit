import type { Metadata } from 'next';
import AuthPage from '../components/AuthPage';

export const metadata: Metadata = {
  title: 'Registrati',
  description: 'Crea il tuo account OmniHabit e inizia a costruire le tue abitudini.'
};

export default function RegisterPage() {
  return <AuthPage mode="register" />;
}
