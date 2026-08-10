import type { Metadata } from 'next';
import DocPage from '../components/DocPage';

export const metadata: Metadata = {
  title: 'Il Metodo',
  description: 'Il protocollo OmniHabit: neuroscienza, sistemi, deep work e le leggi di Atomic Habits spiegate passo dopo passo.'
};

export default function MetodoRoute() {
  return <DocPage />;
}
