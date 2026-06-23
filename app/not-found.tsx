import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ページが見つかりません',
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl mb-6">🏚️</p>
        <h1 className="text-3xl font-bold text-slate-800 mb-3">ページが見つかりません</h1>
        <p className="text-slate-500 mb-2 text-sm">
          お探しのページは移動または削除された可能性があります。
        </p>
        <p className="text-slate-400 mb-8 text-xs">404 Not Found</p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors inline-block"
        >
          トップページへ戻る
        </Link>
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-blue-600">
          <Link href="/tools/surface-yield" className="hover:underline">表面利回り計算</Link>
          <Link href="/tools/net-yield" className="hover:underline">実質利回り計算</Link>
          <Link href="/tools/cashflow" className="hover:underline">CF計算</Link>
          <Link href="/guide" className="hover:underline">不動産投資の基礎</Link>
        </div>
      </div>
    </div>
  );
}
