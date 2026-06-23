import type { Metadata } from 'next';
import CashflowCalculator from '@/components/calculators/CashflowCalculator';

export const metadata: Metadata = {
  title: 'ローン返済・キャッシュフロー計算ツール',
  description:
    '不動産投資のローン返済額・月間キャッシュフロー・年間CF・自己資金利回りを自動計算。元利均等・元金均等返済に対応。初心者向け無料シミュレーター。',
};

export default function CashflowPage() {
  return (
    <div>
      <div className="bg-white border-b border-slate-100 py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-slate-500 mb-1">
            <a href="/" className="hover:text-blue-600">ホーム</a>
            <span className="mx-2">›</span>
            ローン返済・CF計算
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">ローン返済・キャッシュフロー計算</h1>
          <p className="text-slate-500 mt-1 text-sm">
            ローン返済後の手取りキャッシュフローをシミュレーションします
          </p>
        </div>
      </div>
      <CashflowCalculator />
    </div>
  );
}
