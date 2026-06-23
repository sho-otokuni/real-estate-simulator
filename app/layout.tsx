import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: '不動産投資シミュレーター｜無料計算ツール',
    template: '%s｜不動産投資シミュレーター',
  },
  description:
    '表面利回り・実質利回り・ローン返済キャッシュフローを無料で簡単計算。不動産投資初心者から中級者向けの計算ツールサイトです。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
