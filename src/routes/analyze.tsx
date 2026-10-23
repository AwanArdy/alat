import { createFileRoute } from '@tanstack/react-router';
import { SummarizeTranslatePdf } from '../components/SummarizeTranslatePdf';

export const Route = createFileRoute('/analyze')({
  component: SummarizeTranslatePdf,
});
