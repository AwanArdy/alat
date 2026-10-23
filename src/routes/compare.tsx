import { createFileRoute } from '@tanstack/react-router';
import { ComparePdf } from '../components/ComparePdf';

export const Route = createFileRoute('/compare')({
  component: ComparePdf,
});
