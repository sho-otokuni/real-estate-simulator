import type { Metadata } from 'next';
import CashflowCalculator from '@/components/calculators/CashflowCalculator';

export const metadata: Metadata = {
  title: '不動産投資キャッシュフロー計算ツール',
  description:
    '不動産投資のローン返済額・月間キャッシュフロー・年間CF・自己資金利回りを自動計算。元利均等・元金均等返済に対応。初心者向け無料シミュレーター。',
};

const FAQS = [
  {
    q: '月間キャッシュフローはいくらあれば良いですか？',
    a: '一般的に月間1万円以上のプラスが一つの目安とされています。月3万円以上あれば、空室や修繕費が発生しても余裕を持って対応できる水準です。マイナスの場合は毎月の持ち出しが発生するため、長期的な資金計画を慎重に検討してください。',
  },
  {
    q: '元利均等返済と元金均等返済の違いは何ですか？',
    a: '元利均等返済は毎月の返済額（元金＋利息の合計）が一定で、資金計画が立てやすい方式です。元金均等返済は毎月の元金返済額が一定で、返済が進むにつれて月額返済額が減少します。総支払利息は元金均等のほうが少なくなりますが、借入初期の月額返済額が高くなります。',
  },
  {
    q: 'イールドギャップとは何ですか？',
    a: 'イールドギャップとは、実質利回りと借入金利の差（イールドギャップ＝実質利回り − 借入金利）のことです。この差が大きいほどレバレッジ効果が高く、安全性の高い投資とされます。一般的に2%以上のイールドギャップが確保できると安全圏とされており、2〜3%が一つの目安です。',
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

export default function CashflowPage() {
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
            ローン返済・CF計算
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">不動産投資キャッシュフロー計算ツール</h1>
          <p className="text-slate-500 mt-1 text-sm">
            ローン返済後の手取りキャッシュフローをシミュレーションします
          </p>
        </div>
      </div>

      <CashflowCalculator />

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-slate-800 mb-5">キャッシュフロー計算に関するよくある質問</h2>
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
              <a href="/articles/cash-flow" className="text-sm text-blue-700 hover:underline">
                不動産投資のキャッシュフロー計算方法と改善のポイント →
              </a>
            </li>
            <li>
              <a href="/articles/vacancy-rate" className="text-sm text-blue-700 hover:underline">
                空室率が収益に与える影響｜損益分岐ラインの考え方 →
              </a>
            </li>
            <li>
              <a href="/articles/investment-decision" className="text-sm text-blue-700 hover:underline">
                不動産投資で買ってはいけない物件の特徴5選 →
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
