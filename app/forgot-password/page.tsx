import type { Metadata } from 'next';
import ForgotPasswordPage from '../components/ForgotPasswordPage';

export const metadata: Metadata = {
  title: 'Password dimenticata',
  description: 'Recupera l\'accesso al tuo account OmniHabit.'
};

export default function ForgotPasswordPageRoute() {
  return <ForgotPasswordPage />;
}
