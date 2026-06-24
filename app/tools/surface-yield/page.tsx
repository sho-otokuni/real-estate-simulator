import type { Metadata } from 'next';
import SurfaceYieldCalculator from '@/components/calculators/SurfaceYieldCalculator';

export const metadata: Metadata = {
  title: '表面利回り計算ツール',
  description:
    '物件価格と月額家賃を入力するだけで表面利回りを自動計算。計算式も表示するので仕組みまで理解できます。不動産投資初心者向け無料ツール。',
};

const FAQS = [
  {
    q: '表面利回りの目安は何%ですか？',
    a: '一般的に、地方エリアの物件で8〜12%、都市部・首都圏のマンションで5〜8%程度が目安です。ただし高い利回りには築古・立地・空室リスクなどが伴う場合があります。表面利回りはあくまでスクリーニング指標として使い、次のステップで実質利回りも必ず確認しましょう。',
  },
  {
    q: '表面利回りと実質利回りの違いは何ですか？',
    a: '表面利回りは管理費・修繕費・固定資産税・空室などの経費を考慮しない「見た目の利回り」です。実質利回り（ネット利回り）はこれらの経費を差し引いた実態に近い利回りで、一般的に表面利回りより2〜4%低くなります。投資判断には実質利回りの確認が不可欠です。',
  },
  {
    q: '表面利回りが高い物件は良い投資ですか？',
    a: '必ずしもそうではありません。高い表面利回りには、築古・地方・管理状態の問題など何らかのリスクが隠れていることが多いです。表面利回りはスクリーニングの第一歩として使い、実質利回り計算とキャッシュフロー計算で総合的に判断することが重要です。',
  },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function SurfaceYieldPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

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

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-slate-800 mb-5">表面利回りに関するよくある質問</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-slate-800 select-none">
                Q. {q}
              </summary>
              <div className="px-5 pb-5 border-t border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed pt-3">{a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-10">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <p className="text-sm font-semibold text-blue-800 mb-3">📖 関連コラム</p>
          <ul className="space-y-2">
            <li>
              <a href="/articles/gross-yield" className="text-sm text-blue-700 hover:underline">
                表面利回りとは？計算方法と目安をわかりやすく解説 →
              </a>
            </li>
            <li>
              <a href="/articles/net-yield" className="text-sm text-blue-700 hover:underline">
                実質利回りとは？表面利回りとの違いと計算方法 →
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
