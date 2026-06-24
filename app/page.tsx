import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '不動産投資シミュレーター｜無料計算ツール',
  description:
    '表面利回り・実質利回り・ローン返済キャッシュフローを無料で簡単計算できます。不動産投資初心者〜中級者向けの無料Webツールです。',
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '不動産投資シミュレーター',
  url: 'https://real-estate-simulator-five.vercel.app',
  description: '表面利回り・実質利回り・ローン返済キャッシュフローを無料で簡単計算。不動産投資初心者向けの無料Webツール。',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: 'ja',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
  },
};

const tools = [
  {
    href: '/tools/surface-yield',
    icon: '📈',
    title: '表面利回り計算',
    description: '物件価格と家賃から、見た目の利回りを即計算。まず最初に確認する指標です。',
    color: 'border-blue-200 hover:border-blue-400',
    badge: '入門',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    href: '/tools/net-yield',
    icon: '💰',
    title: '実質利回り計算',
    description: '管理費・修繕費・税金・空室率を考慮した、より現実的な収益率を計算します。',
    color: 'border-green-200 hover:border-green-400',
    badge: '中級',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    href: '/tools/cashflow',
    icon: '🏦',
    title: 'ローン返済・CF計算',
    description: 'ローン返済後の月間・年間キャッシュフローを算出。実際に手元に残る金額を確認できます。',
    color: 'border-purple-200 hover:border-purple-400',
    badge: '重要',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
];

const features = [
  { icon: '⚡', title: '即時計算', description: '入力するたびにリアルタイムで結果が更新されます' },
  { icon: '📱', title: 'スマホ対応', description: '物件検索中でもスマホで手軽に計算できます' },
  { icon: '📐', title: '計算式も見える', description: 'すべての計算式を公開。ブラックボックスなし' },
  { icon: '🆓', title: '完全無料', description: '会員登録不要。すぐ使えます' },
];

export default function TopPage() {
  return (
    <div>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-300 text-sm font-medium mb-3 tracking-wide">不動産投資 × 計算ツール</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            不動産投資の利回り・<br className="sm:hidden" />
            キャッシュフロー計算ツール
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            物件を買う前に、まず計算してみよう。<br />
            表面利回り・実質利回り・CFを無料で簡単計算。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tools/surface-yield"
              className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-base"
            >
              まずは表面利回りを計算する →
            </Link>
            <Link
              href="/guide"
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3 rounded-xl transition-colors text-base"
            >
              不動産投資の基礎を学ぶ
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">計算ツール一覧</h2>
          <p className="text-slate-500 text-center text-sm mb-10">
            この順番で使うと、投資判断がスムーズになります
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {tools.map((tool, i) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={`bg-white rounded-2xl border-2 ${tool.color} p-6 shadow-sm hover:shadow-md transition-all group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{tool.icon}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-400">Step {i + 1}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{tool.description}</p>
                <p className="mt-4 text-sm text-blue-600 font-medium group-hover:underline">
                  計算してみる →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">使い方は3ステップ</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '1', title: '物件情報を入力', desc: '価格・家賃・ローン条件などを入力。すべてスライダーや数値入力で簡単です。' },
              { step: '2', title: '即時で計算結果が出る', desc: '入力するたびにリアルタイムで計算。何度でも試せます。' },
              { step: '3', title: '計算式で仕組みを理解', desc: '計算式も一緒に表示。数字の意味を理解しながら使えます。' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">このツールの特徴</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
                <p className="text-3xl mb-3">{f.icon}</p>
                <h3 className="font-semibold text-slate-800 mb-1 text-sm">{f.title}</h3>
                <p className="text-xs text-slate-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide CTA */}
      <section className="bg-slate-800 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">利回りって何？という方へ</h2>
          <p className="text-slate-300 mb-8 text-sm sm:text-base">
            「利回りとキャッシュフローの違いは？」「ローンを使うメリットは？」など、
            不動産投資の基礎用語をわかりやすく解説しています。
          </p>
          <Link
            href="/guide"
            className="bg-white text-slate-800 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition-colors inline-block"
          >
            不動産投資の基礎を読む →
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-amber-700 mb-2">⚠️ 免責事項</p>
          <p className="text-xs text-amber-800 leading-relaxed">
            本サイトの計算結果は概算・参考値であり、実際の投資成果を保証するものではありません。
            本サービスは金融商品取引法に基づく投資助言・投資勧誘を行うものではありません。
            投資判断は必ず専門家にご相談のうえ、ご自身の責任においておこなってください。
          </p>
        </div>
      </div>
    </div>
  );
}
