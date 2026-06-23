import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '不動産投資の基礎知識｜利回り・CF・ローンをわかりやすく解説',
  description:
    '表面利回り・実質利回り・キャッシュフロー・不動産ローンの基礎を初心者向けに解説。計算式と具体例で仕組みを理解できます。',
};

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="mb-14 scroll-mt-20">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-5 pb-3 border-b-2 border-blue-100">
        {title}
      </h2>
      <div className="space-y-4 text-slate-700 leading-relaxed">{children}</div>
    </section>
  );
}

function HighlightBox({ children, color = 'blue' }: { children: React.ReactNode; color?: 'blue' | 'green' | 'amber' }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
  };
  return (
    <div className={`border rounded-xl p-4 text-sm ${colors[color]}`}>
      {children}
    </div>
  );
}

function FormulaInline({ formula }: { formula: string }) {
  return (
    <code className="block bg-slate-100 border border-slate-200 rounded-lg px-4 py-3 text-sm text-blue-700 font-mono my-3">
      {formula}
    </code>
  );
}

const tocItems = [
  { id: 'yield-basics', label: '利回りとは' },
  { id: 'surface-yield', label: '表面利回り' },
  { id: 'net-yield', label: '実質利回り' },
  { id: 'cashflow', label: 'キャッシュフロー' },
  { id: 'loan', label: '不動産ローンの基礎' },
  { id: 'leverage', label: 'レバレッジ効果' },
  { id: 'checklist', label: '購入前チェックリスト' },
];

export default function GuidePage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-slate-500 mb-1">
            <a href="/" className="hover:text-blue-600">ホーム</a>
            <span className="mx-2">›</span>
            不動産投資の基礎
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">不動産投資の基礎知識</h1>
          <p className="text-slate-500 mt-1 text-sm">
            利回り・キャッシュフロー・ローンの仕組みを初心者向けに解説します
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* TOC (desktop sidebar) */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">目次</p>
              <ul className="space-y-1">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded px-2 py-1.5 transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3">
            {/* TOC (mobile) */}
            <div className="lg:hidden bg-white rounded-2xl border border-slate-100 p-5 shadow-sm mb-8">
              <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">目次</p>
              <div className="flex flex-wrap gap-2">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-xs bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 rounded-full px-3 py-1 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <Section id="yield-basics" title="📊 利回りとは">
              <p>
                <strong>利回り</strong>とは、投資した金額に対して、年間でどれくらいのリターン（収益）が得られるかを
                パーセントで表した指標です。
              </p>
              <p>
                例えば、1,000万円の投資で年間50万円の収益があれば、利回りは<strong>5%</strong>です。
              </p>
              <FormulaInline formula="利回り（%）＝ 年間収益 ÷ 投資金額 × 100" />
              <HighlightBox color="blue">
                <p>
                  不動産投資では「表面利回り」と「実質利回り」の2種類があります。
                  同じ物件でも数値が大きく異なるため、両方を理解することが重要です。
                </p>
              </HighlightBox>
            </Section>

            <Section id="surface-yield" title="📈 表面利回り（グロス利回り）">
              <p>
                表面利回りとは、<strong>経費を差し引かずに計算した、見た目上の利回り</strong>です。
                「グロス利回り」とも呼ばれます。物件の概算チェックに使います。
              </p>
              <FormulaInline formula="表面利回り（%）＝ 年間家賃収入 ÷ 物件価格 × 100" />
              <div className="bg-slate-50 rounded-xl p-5">
                <p className="text-sm font-semibold text-slate-700 mb-3">具体例</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>物件価格：1,500万円</li>
                  <li>月額家賃：8.5万円 → 年間：102万円</li>
                  <li>表面利回り：<strong className="text-blue-600">102 ÷ 1,500 × 100 ＝ 6.8%</strong></li>
                </ul>
              </div>
              <HighlightBox color="amber">
                <p>
                  ⚠️ <strong>表面利回りだけで判断してはいけません。</strong><br />
                  管理費・修繕費・税金・空室期間などの経費が含まれていないため、
                  実際の手取りはこれより大幅に少なくなります。
                </p>
              </HighlightBox>
              <p className="text-sm">
                <strong>目安：</strong>地方戸建て10〜15%、地方区分マンション8〜12%、
                都市部マンション5〜8%程度（物件・時期により大きく異なります）
              </p>
              <div className="mt-4">
                <Link
                  href="/tools/surface-yield"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  📈 表面利回りを計算する →
                </Link>
              </div>
            </Section>

            <Section id="net-yield" title="💰 実質利回り（ネット利回り）">
              <p>
                実質利回りとは、<strong>各種経費や空室を考慮した、実際に近い利回り</strong>です。
                「ネット利回り」とも呼ばれます。
              </p>
              <FormulaInline formula="実質利回り（%）＝（年間家賃 × (1-空室率) - 年間経費）÷（物件価格 + 購入諸費用）× 100" />
              <div className="bg-slate-50 rounded-xl p-5">
                <p className="text-sm font-semibold text-slate-700 mb-3">経費の主な内訳</p>
                <ul className="text-sm text-slate-600 space-y-1.5">
                  <li>🏢 <strong>管理費</strong>：管理会社への委託料（家賃の5〜10%）</li>
                  <li>🔧 <strong>修繕積立金</strong>：区分マンションは管理組合への積立</li>
                  <li>🏛 <strong>固定資産税・都市計画税</strong>：年1〜2回の納税</li>
                  <li>🔥 <strong>火災保険料</strong>：年間保険料</li>
                  <li>📢 <strong>広告費・原状回復費</strong>：退去時のリフォームなど</li>
                </ul>
              </div>
              <HighlightBox color="green">
                <p>
                  ✅ 表面利回りと実質利回りの差は<strong>2〜4%程度</strong>になることが多いです。
                  例えば表面利回り8%の物件でも、実質利回りは4〜6%になることがよくあります。
                </p>
              </HighlightBox>
              <div className="mt-4">
                <Link
                  href="/tools/net-yield"
                  className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors"
                >
                  💰 実質利回りを計算する →
                </Link>
              </div>
            </Section>

            <Section id="cashflow" title="🏦 キャッシュフロー（CF）">
              <p>
                キャッシュフロー（CF）とは、<strong>家賃収入からローン返済・経費をすべて引いた後の実際の手取り収益</strong>です。
                投資の「実際のお金の流れ」を表します。
              </p>
              <FormulaInline formula="月間CF ＝ 月額家賃収入 − 月返済額 − 月間経費（年間経費 ÷ 12）" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-green-700 mb-2">✅ CFプラスの状態</p>
                  <p className="text-sm text-green-800">
                    毎月手元にお金が残る。理想的な状態。
                    ローン返済も家賃収入でまかなえています。
                  </p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-700 mb-2">⚠️ CFマイナスの状態</p>
                  <p className="text-sm text-red-800">
                    毎月自己資金を持ち出す必要がある。
                    資産価値の上昇を期待する場合もありますが、
                    資金繰りリスクに注意が必要です。
                  </p>
                </div>
              </div>
              <HighlightBox color="blue">
                <p>
                  💡 <strong>利回りが良くてもCFがマイナスになることがあります。</strong><br />
                  特にローンを使う場合、返済額が大きいとCFがマイナスになりやすいです。
                  実質利回りと金利の差（イールドギャップ）も重要な指標です。
                </p>
              </HighlightBox>
              <div className="mt-4">
                <Link
                  href="/tools/cashflow"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-purple-700 transition-colors"
                >
                  🏦 ローン・CF計算をする →
                </Link>
              </div>
            </Section>

            <Section id="loan" title="🏛 不動産ローンの基礎">
              <p>
                不動産投資では、自己資金だけでなく<strong>金融機関からローンを借りて購入</strong>するのが一般的です。
                ローンの返済方式には主に2種類あります。
              </p>

              <div className="grid sm:grid-cols-2 gap-4 my-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-800 mb-3">元利均等返済</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    毎月の返済額（元金＋利息）が一定。計画が立てやすく、一般的な住宅ローンでよく使われます。
                  </p>
                  <FormulaInline formula="月返済額 ＝ 借入 × 月利 × (1+月利)ⁿ ÷ ((1+月利)ⁿ - 1)" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-800 mb-3">元金均等返済</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    元金を均等に返済。初期の返済額は多いが、残高が減るにつれ返済額が減少。
                    総支払利息は元利均等より少ない。
                  </p>
                  <FormulaInline formula="月返済 ＝ 元金÷返済月数 ＋ 残高×月利" />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5">
                <p className="text-sm font-semibold text-slate-700 mb-3">金利の種類</p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li><strong>変動金利</strong>：市場金利に連動して変動。現在は低いが将来上昇リスクあり。</li>
                  <li><strong>固定金利</strong>：期間中は金利が固定。返済額が安定するが、変動より高め。</li>
                  <li><strong>固定期間選択型</strong>：一定期間固定後、変動か再固定を選べる。</li>
                </ul>
              </div>
            </Section>

            <Section id="leverage" title="⚡ レバレッジ効果とは">
              <p>
                レバレッジとは「てこの原理」のことで、<strong>少ない自己資金で大きな投資を行うこと</strong>です。
                不動産投資では、ローンを使うことでレバレッジをかけられます。
              </p>
              <div className="bg-slate-50 rounded-xl p-5">
                <p className="text-sm font-semibold text-slate-700 mb-3">具体例</p>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">自己資金のみで購入</p>
                    <ul className="space-y-1">
                      <li>投資金額：1,500万円（自己資金）</li>
                      <li>年間CF：45万円</li>
                      <li>CF利回り：<strong>3%</strong></li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">ローン活用（頭金300万円）</p>
                    <ul className="space-y-1">
                      <li>自己資金：300万円</li>
                      <li>年間CF：20万円（返済後）</li>
                      <li>自己資金利回り：<strong>6.7%</strong>（自己資金対比）</li>
                    </ul>
                  </div>
                </div>
              </div>
              <HighlightBox color="amber">
                <p>
                  ⚠️ ただし、実質利回りが金利を大きく上回らないと逆レバレッジになります。
                  「イールドギャップ（実質利回り - 金利）が2〜3%以上」を目安にする投資家も多いです。
                </p>
              </HighlightBox>
            </Section>

            <Section id="checklist" title="✅ 物件購入前チェックリスト">
              <div className="space-y-3">
                {[
                  { check: '表面利回りを確認した', tool: '/tools/surface-yield' },
                  { check: '実質利回りを計算した（経費・空室考慮）', tool: '/tools/net-yield' },
                  { check: 'ローン返済後のCFがプラスになることを確認した', tool: '/tools/cashflow' },
                  { check: '自己資金利回り（CF利回り）が自己資金の機会コストを上回っている', tool: null },
                  { check: 'エリアの賃貸需要・競合物件を調査した', tool: null },
                  { check: '修繕履歴・建物の状態を確認した', tool: null },
                  { check: '税理士やFPに相談した', tool: null },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-0.5 accent-blue-600 flex-shrink-0 cursor-pointer"
                    />
                    <span className="text-sm text-slate-700 flex-1">{item.check}</span>
                    {item.tool && (
                      <Link href={item.tool} className="text-xs text-blue-600 hover:underline whitespace-nowrap">
                        計算する →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            {/* CTA */}
            <div className="bg-blue-600 text-white rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold mb-3">さあ、計算してみましょう</h3>
              <p className="text-blue-100 text-sm mb-6">
                気になる物件の情報を入力するだけで、すぐに利回りとCFが計算できます
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/surface-yield"
                  className="bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
                >
                  表面利回り計算
                </Link>
                <Link
                  href="/tools/net-yield"
                  className="bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-400 transition-colors text-sm"
                >
                  実質利回り計算
                </Link>
                <Link
                  href="/tools/cashflow"
                  className="bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-400 transition-colors text-sm"
                >
                  ローン・CF計算
                </Link>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-xs font-semibold text-amber-700 mb-2">⚠️ ご注意</p>
              <p className="text-xs text-amber-800 leading-relaxed">
                本ページの内容は情報提供を目的としており、投資助言・投資勧誘を目的とするものではありません。
                実際の投資判断は、ご自身の状況を踏まえて専門家（税理士・ファイナンシャルプランナー等）にご相談ください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
