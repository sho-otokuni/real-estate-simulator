import type { Metadata } from 'next';
import NetYieldCalculator from '@/components/calculators/NetYieldCalculator';

export const metadata: Metadata = {
  title: '実質利回り計算ツール（ネット利回り）',
  description:
    '管理費・修繕積立金・固定資産税・空室率を考慮した実質利回りを自動計算。表面利回りとの違いも一目でわかります。不動産投資シミュレーター。',
};

const FAQS = [
  {
    q: '実質利回りの目安は何%ですか？',
    a: '一般的に3%以上が一つの目安とされています。ローンを使う場合は借入金利との差（イールドギャップ）が2%以上確保できると安全圏とされます。都市部・首都圏のマンションでは3〜5%、地方物件では5〜8%程度が多く見られる水準です。',
  },
  {
    q: '表面利回りとの差はどれくらいですか？',
    a: '物件・経費の状況によりますが、一般的に2〜4%程度の差が生じます。例えば表面利回り8%の物件でも、管理費・修繕積立金・固定資産税・空室を考慮すると実質利回りは4〜6%になることが多いです。この差を確認することが投資判断のポイントです。',
  },
  {
    q: '実質利回り3%は良いですか？低いですか？',
    a: 'エリアや物件種別により異なります。都市部・首都圏のマンションであれば3%は標準的な水準です。ただし借入金利が1.5%の場合、イールドギャップは1.5%しかなく、空室率の上昇や修繕費の増加でキャッシュフローがマイナスになるリスクがあります。CFシミュレーターで合わせて確認しましょう。',
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

export default function NetYieldPage() {
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
            実質利回り計算
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">実質利回り計算ツール（ネット利回り）</h1>
          <p className="text-slate-500 mt-1 text-sm">
            経費・空室を考慮した、より現実的な利回りを計算します
          </p>
        </div>
      </div>

      <NetYieldCalculator />

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-slate-800 mb-5">実質利回りに関するよくある質問</h2>
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
    </div>
  );
}
