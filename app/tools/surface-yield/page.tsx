import type { Metadata } from 'next';
import SurfaceYieldCalculator from '@/components/calculators/SurfaceYieldCalculator';

export const metadata: Metadata = {
  title: '表面利回り計算ツール',
  description:
    '物件価格と月額家賃を入力するだけで表面利回りを自動計算。計算式も表示するので仕組みまで理解できます。不動産投資初心者向け無料ツール。',
};

export default function SurfaceYieldPage() {
  return (
    <div>
      <div className="bg-white border-b border-slate-100 py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-slate-500 mb-1">
            <a href="/" className="hover:text-blue-600">ホーム</a>
            <span className="mx-2">›</span>
            表面利回り計算
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">表面利回り計算ツール</h1>
          <p className="text-slate-500 mt-1 text-sm">
            物件価格と家賃から、瞬時に利回りを計算します
          </p>
        </div>
      </div>
      <SurfaceYieldCalculator />
    </div>
  );
}
