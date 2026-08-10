import type { Metadata } from 'next';
import PrivacyPage from '../components/PrivacyPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'La Privacy Policy di OmniHabit: come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali.'
};

export default function PrivacyRoute() {
  return <PrivacyPage />;
}
