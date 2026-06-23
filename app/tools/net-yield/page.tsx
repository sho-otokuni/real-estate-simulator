import type { Metadata } from 'next';
import NetYieldCalculator from '@/components/calculators/NetYieldCalculator';

export const metadata: Metadata = {
  title: '実質利回り計算ツール',
  description:
    '管理費・修繕積立金・固定資産税・空室率を考慮した実質利回りを自動計算。表面利回りとの違いも一目でわかります。不動産投資シミュレーター。',
};

export default function NetYieldPage() {
  return (
    <div>
      <div className="bg-white border-b border-slate-100 py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-slate-500 mb-1">
            <a href="/" className="hover:text-blue-600">ホーム</a>
            <span className="mx-2">›</span>
            実質利回り計算
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">実質利回り計算ツール</h1>
          <p className="text-slate-500 mt-1 text-sm">
            経費・空室を考慮した、より現実的な利回りを計算します
          </p>
        </div>
      </div>
      <NetYieldCalculator />
    </div>
  );
}
