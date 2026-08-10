import type { Metadata } from 'next';
import TermsPage from '../components/TermsPage';

export const metadata: Metadata = {
  title: 'Termini di Servizio',
  description: 'I Termini di Servizio di OmniHabit: le condizioni di utilizzo della piattaforma di tracciamento abitudini.'
};

export default function TerminiRoute() {
  return <TermsPage />;
}
