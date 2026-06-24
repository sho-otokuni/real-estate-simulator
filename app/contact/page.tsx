import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: '不動産投資シミュレーターへのお問い合わせ・改善要望はこちらからどうぞ。',
};

export default function ContactPage() {
  return <ContactForm />;
}
