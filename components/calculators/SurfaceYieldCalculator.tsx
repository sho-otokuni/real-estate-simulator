'use client';

import { useState } from 'react';
import InputField from '@/components/ui/InputField';
import ResultCard from '@/components/ui/ResultCard';
import FormulaBox from '@/components/ui/FormulaBox';
import Disclaimer from '@/components/ui/Disclaimer';
import HowToUseBox from '@/components/ui/HowToUseBox';
import AdvisorCard, { AdvisorGrade } from '@/components/ui/AdvisorCard';
import SurfaceYieldVacancyPanel from '@/components/ui/SurfaceYieldVacancyPanel';
import { calcSurfaceYield } from '@/lib/calculators/surfaceYield';

function getAdvisorData(surfaceYield: number, targetPrice5: number | null, targetRent5: number | null): {
  grade: AdvisorGrade;
  gradeLabel: string;
  summary: string;
  positives: string[];
  cautions: string[];
  suggestions: string[];
} {
  if (surfaceYield >= 10) {
    return {
      grade: 'S',
      gradeLabel: '非常に高い利回り',
      summary:
        '表面利回り10%以上は非常に高い水準です。収益性は魅力的ですが、高利回り物件には相応のリスクが伴うことが多いです。実質利回りの確認が不可欠です。',
      positives: [
        '収益性が非常に高く、経費を差し引いても利益が残りやすい',
        '表面利回りだけで見れば投資効率は優秀',
      ],
      cautions: [
        '高利回り物件は築古・地方・管理状態に問題があるケースも多い',
        '空室リスク・大規模修繕費が高くなる可能性がある',
        '表面利回りと実質利回りの差が大きくなりがち（5〜6%の開きも）',
      ],
      suggestions: [
        '実質利回り計算で管理費・修繕費・税金を加味した収益性を確認しましょう',
        'ローン返済後のキャッシュフローも必ず確認することをおすすめします',
      ],
    };
  } else if (surfaceYield >= 7) {
    return {
      grade: 'A',
      gradeLabel: '良好な水準',
      summary:
        '表面利回り7〜10%は良好な水準です。経費を差し引いた後も一定の収益性が期待できます。次のステップとして実質利回りを確認しましょう。',
      positives: [
        '収益性は良好な水準で、複数物件との比較でも優位性がある',
        '実質利回りでも4〜7%程度が期待できる場合が多い',
      ],
      cautions: [
        '経費・空室率によっては実質利回りが大幅に下がる可能性がある',
        '表面利回りだけで購入を決断するのは危険',
      ],
      suggestions: [
        '実質利回り計算で経費を加味した数字を確認しましょう',
        'ローン条件によってはキャッシュフローが薄くなることもあります',
      ],
    };
  } else if (surfaceYield >= 5) {
    return {
      grade: 'B',
      gradeLabel: '一般的な水準',
      summary:
        '表面利回り5〜7%は一般的な水準です。都市部や安定エリアの物件に多いレンジで、実質利回りでも一定の収益が見込めます。',
      positives: [
        '都市部・人気エリアの物件に多い安定した水準',
        '資産価値の維持が期待できるエリアが多い',
      ],
      cautions: [
        '実質利回りは3〜5%程度になる可能性が高い',
        'ローン金利とのスプレッドを必ず確認すること',
      ],
      suggestions: [
        '実質利回り計算で経費を加味した収益性を確認しましょう',
        'ローン金利との差（イールドギャップ）が2%以上あることを確認しましょう',
      ],
    };
  } else {
    return {
      grade: 'C',
      gradeLabel: 'やや低い水準',
      summary:
        '表面利回り5%未満はやや低い水準です。購入価格の値引き交渉や家賃設定の見直しを検討するか、長期的な資産価値重視の投資として位置づける必要があります。',
      positives: [
        '価格が高め＝安定した立地・物件の可能性がある',
        '長期保有・売却益（キャピタルゲイン）狙いの投資に向いている場合も',
      ],
      cautions: [
        '実質利回りは2〜3%以下になりやすく、ローン金利との差が縮まる',
        'キャッシュフローがマイナスになるリスクが高い',
        '持ち出しが続く場合に備えた手元資金の確保が重要',
      ],
      suggestions: [
        targetPrice5 !== null
          ? `表面利回り5%達成には物件価格を${targetPrice5}万円以下に抑える必要があります`
          : '物件価格の値引き交渉を検討しましょう',
        targetRent5 !== null
          ? `または月額家賃を${targetRent5}万円以上にできないか確認しましょう`
          : '家賃設定の見直しを検討しましょう',
      ],
    };
  }
}

export default function SurfaceYieldCalculator() {
  const [propertyPrice, setPropertyPrice] = useState<number | null>(null);
  const [monthlyRent, setMonthlyRent] = useState<number | null>(null);

  const result =
    propertyPrice !== null && monthlyRent !== null
      ? calcSurfaceYield({ propertyPrice, monthlyRent })
      : null;

  // 目標利回り5%達成に必要な数値（動的計算）
  const targetPrice5 =
    monthlyRent !== null ? Math.round((monthlyRent * 12) / 0.05) : null;
  const targetRent5 =
    propertyPrice !== null
      ? Math.round((propertyPrice * 0.05) / 12 * 10) / 10
      : null;
  const targetPrice7 =
    monthlyRent !== null ? Math.round((monthlyRent * 12) / 0.07) : null;
  const targetRent7 =
    propertyPrice !== null
      ? Math.round((propertyPrice * 0.07) / 12 * 10) / 10
      : null;

  const advisorData =
    result !== null ? getAdvisorData(result.surfaceYield, targetPrice5, targetRent5) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Intro */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
        <p className="text-sm text-blue-800 leading-relaxed">
          <strong>表面利回り</strong>とは、物件価格に対する年間家賃収入の割合のことです。
          管理費・空室などを考慮しない<strong>「見た目の利回り」</strong>で、物件を探す最初のステップで使います。
          目安は一般的に<strong>5〜10%程度</strong>ですが、エリアや物件種別によって異なります。
        </p>
      </div>

      {/* How to use (collapsible) */}
      <HowToUseBox
        whatYouLearn={
          <p>
            物件価格と家賃収入から<strong>「表面利回り」</strong>を計算します。
            経費や空室を考慮しない見た目の収益率として、物件探しの最初のスクリーニングに活用できます。
          </p>
        }
        whenToUse={
          <p>
            気になる物件を見つけたとき、まず最初に確認する指標です。
            複数の物件を<strong>素早く比較</strong>したいときにも便利です。
          </p>
        }
        inputGuide={
          <ul className="space-y-1.5">
            <li>
              <strong>物件価格：</strong>チラシや物件サイトに記載されている販売価格（万円単位）
            </li>
            <li>
              <strong>月額家賃：</strong>
              入居者から受け取る家賃の月合計。複数部屋がある場合は全室分を合計してください
            </li>
          </ul>
        }
        resultGuide={
          <ul className="space-y-1.5">
            <li>5〜10%が一般的な水準の目安</li>
            <li>10%以上は高利回りですが、物件リスクも要確認</li>
            <li>
              これは<strong>「見た目の数字」</strong>です。次は実質利回りで経費を加味した収益性も必ず確認しましょう
            </li>
          </ul>
        }
      />

      {/* Mobile: key result shown at top so users don't need to scroll */}
      {result && (
        <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <p className="text-xs text-slate-500 mb-1">表面利回り</p>
          <p
            className={`text-3xl font-bold ${
              result.surfaceYield >= 7
                ? 'text-green-600'
                : result.surfaceYield >= 5
                  ? 'text-blue-600'
                  : 'text-amber-600'
            }`}
          >
            {result.surfaceYield.toFixed(2)}%
          </p>
          <p className="text-xs text-slate-400 mt-0.5">年間家賃 ÷ 物件価格 × 100</p>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Input panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6 lg:mb-0">
            <h2 className="text-base font-semibold text-slate-800 mb-4">物件情報を入力</h2>
            <InputField
              label="物件価格"
              value={propertyPrice}
              onChange={setPropertyPrice}
              unit="万円"
              hint="チラシや物件サイトに記載されている販売価格"
              min={1}
              step={50}
              placeholder="例：1500"
            />
            <InputField
              label="月額家賃収入（満室時合計）"
              value={monthlyRent}
              onChange={setMonthlyRent}
              unit="万円"
              hint="複数の部屋がある場合は全室の家賃を合計してください"
              min={0.1}
              step={0.5}
              placeholder="例：8.5"
            />
          </div>
        </div>

        {/* Result panel */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-20">
            <h2 className="text-lg font-semibold text-slate-800 mb-5">計算結果</h2>

            {result ? (
              <div>
                {/* Main result highlight */}
                <div
                  className={`rounded-xl p-5 mb-5 text-center ${
                    result.surfaceYield >= 7
                      ? 'bg-green-50 border border-green-200'
                      : result.surfaceYield >= 5
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-amber-50 border border-amber-200'
                  }`}
                >
                  <p className="text-sm text-slate-600 mb-1">表面利回り</p>
                  <p
                    className={`text-5xl font-bold ${
                      result.surfaceYield >= 7
                        ? 'text-green-600'
                        : result.surfaceYield >= 5
                          ? 'text-blue-600'
                          : 'text-amber-600'
                    }`}
                  >
                    {result.surfaceYield.toFixed(2)}
                    <span className="text-2xl font-normal ml-1">%</span>
                  </p>
                </div>

                <ResultCard
                  label="年間家賃収入（満室時）"
                  value={result.annualRent.toFixed(1)}
                  unit="万円"
                  description={`月額 ${monthlyRent}万円 × 12ヶ月`}
                />
                <ResultCard
                  label="投資回収期間（目安）"
                  value={result.paybackYears.toFixed(1)}
                  unit="年"
                  description="経費・空室・ローンを考慮しない単純計算"
                />

                {/* ③ Tiered evaluation comment (4 tiers) */}
                <div className="mt-4 rounded-lg p-4 text-sm bg-slate-50">
                  {result.surfaceYield >= 10 ? (
                    <p className="text-green-700">
                      🌟 表面利回り10%以上。非常に高い水準です。ただし高利回り物件は物件状態・空室リスクを慎重に確認しましょう。
                    </p>
                  ) : result.surfaceYield >= 7 ? (
                    <p className="text-green-700">
                      ✅ 表面利回り7〜10%。良好な水準です。次は実質利回りで経費を加味した収益性を確認しましょう。
                    </p>
                  ) : result.surfaceYield >= 5 ? (
                    <p className="text-blue-700">
                      ℹ️ 表面利回り5〜7%。一般的な水準です。都市部の物件ではよく見られる範囲です。
                    </p>
                  ) : (
                    <p className="text-amber-700">
                      ⚠️ 表面利回り5%未満。やや低い水準です。価格交渉や家賃設定の見直しを検討しましょう。
                    </p>
                  )}
                </div>

                {/* ④ Improvement suggestions (shown when yield < 5%) */}
                {result.surfaceYield < 5 && (
                  <div className="mt-3 rounded-lg p-4 bg-amber-50 border border-amber-200">
                    <p className="text-xs font-semibold text-amber-800 mb-2">
                      💡 利回り改善のための参考数値
                    </p>
                    <ul className="space-y-1.5">
                      {targetPrice5 !== null && (
                        <li className="text-xs text-amber-800">
                          • 表面利回り5%達成には、物件価格を{' '}
                          <strong>{targetPrice5.toLocaleString()}万円以下</strong>{' '}
                          に抑える必要があります
                        </li>
                      )}
                      {targetRent5 !== null && (
                        <li className="text-xs text-amber-800">
                          • または月額家賃を{' '}
                          <strong>{targetRent5}万円以上</strong>{' '}
                          に引き上げられないか確認しましょう
                        </li>
                      )}
                      {targetPrice7 !== null && targetRent7 !== null && (
                        <li className="text-xs text-slate-600 pt-1 border-t border-amber-200 mt-1">
                          ※ 目標7%の場合：物件価格{' '}
                          <strong>{targetPrice7.toLocaleString()}万円以下</strong>
                          、または月額家賃{' '}
                          <strong>{targetRent7}万円以上</strong>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* ⑤ AI advisor card */}
                {advisorData && <AdvisorCard {...advisorData} />}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-400">
                <div className="text-center">
                  <p className="text-4xl mb-3">📊</p>
                  <p className="text-sm">
                    物件価格と月額家賃を入力すると
                    <br />
                    結果がここに表示されます
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vacancy sensitivity simulation */}
      {result !== null && propertyPrice !== null && monthlyRent !== null && (
        <SurfaceYieldVacancyPanel
          propertyPrice={propertyPrice}
          monthlyRentFull={monthlyRent}
        />
      )}

      <FormulaBox
        items={[
          {
            label: '表面利回りの計算式',
            formula: '表面利回り（%）＝ 月額家賃 × 12 ÷ 物件価格 × 100',
            example:
              propertyPrice !== null && monthlyRent !== null && result
                ? `${monthlyRent}万円 × 12 ÷ ${propertyPrice}万円 × 100 ＝ ${result.surfaceYield.toFixed(2)}%`
                : '物件価格と家賃を入力すると計算例が表示されます',
          },
          {
            label: '投資回収期間の計算式',
            formula: '投資回収期間（年）＝ 物件価格 ÷ 年間家賃収入',
            example:
              propertyPrice !== null && result
                ? `${propertyPrice}万円 ÷ ${result.annualRent.toFixed(1)}万円 ＝ ${result.paybackYears.toFixed(1)}年`
                : '物件価格と家賃を入力すると計算例が表示されます',
          },
        ]}
      />

      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-5">
        <p className="text-sm font-semibold text-slate-700 mb-2">💡 次のステップ</p>
        <p className="text-sm text-slate-600">
          表面利回りは管理費・修繕積立金・税金・空室などのコストを含みません。
          より実態に近い収益性は
          <a href="/tools/net-yield" className="text-blue-600 underline mx-1">
            実質利回り計算
          </a>
          でご確認ください。
        </p>
      </div>

      <Disclaimer />
    </div>
  );
}
