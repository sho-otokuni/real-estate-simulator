'use client';

import { useState } from 'react';
import InputField from '@/components/ui/InputField';
import ResultCard from '@/components/ui/ResultCard';
import FormulaBox from '@/components/ui/FormulaBox';
import Disclaimer from '@/components/ui/Disclaimer';
import HowToUseBox from '@/components/ui/HowToUseBox';
import AdvisorCard, { AdvisorGrade } from '@/components/ui/AdvisorCard';
import { calcNetYield } from '@/lib/calculators/netYield';

function getAdvisorData(
  netYield: number,
  targetPropertyPrice: number | null,
  targetMonthlyRent: number | null,
): {
  grade: AdvisorGrade;
  gradeLabel: string;
  summary: string;
  positives: string[];
  cautions: string[];
  suggestions: string[];
} {
  if (netYield >= 6) {
    return {
      grade: 'S',
      gradeLabel: '非常に良好な実質利回り',
      summary:
        '実質利回り6%以上は非常に高い水準です。経費・空室を差し引いた後でもしっかりとした収益が期待できます。',
      positives: [
        '経費・空室後でも十分な収益が見込める',
        'ローン返済後のキャッシュフローもプラスになりやすい',
      ],
      cautions: [
        '高利回りの裏にある物件リスク（築古・立地など）を必ず確認',
        'ローン返済後のキャッシュフローも合わせて確認しましょう',
      ],
      suggestions: [
        'ローン・キャッシュフロー計算で返済後の手取りを確認しましょう',
        '物件の長期修繕計画や管理体制も確認することをおすすめします',
      ],
    };
  } else if (netYield >= 4) {
    return {
      grade: 'A',
      gradeLabel: '良好な実質利回り',
      summary:
        '実質利回り4〜6%は良好な水準です。適切なローン条件であればキャッシュフローをプラスに保てる可能性が高いです。',
      positives: [
        '経費・空室を加味しても十分な収益性がある',
        '都市部の物件としては優秀な水準',
      ],
      cautions: [
        'ローン金利との差（イールドギャップ）を2%以上確保することが望ましい',
        '空室率が想定より高くなった場合の影響を確認しておく',
      ],
      suggestions: [
        'ローン・キャッシュフロー計算で毎月の手取りを確認しましょう',
        '空室率を少し悲観的に設定した場合のシミュレーションもおすすめです',
      ],
    };
  } else if (netYield >= 2) {
    return {
      grade: 'B',
      gradeLabel: '標準的な実質利回り',
      summary:
        '実質利回り2〜4%は標準的な水準です。都市部や人気エリアではよく見られますが、ローン条件によってはキャッシュフローが薄くなります。',
      positives: [
        '安定した立地・物件に多い水準で、資産価値の維持が期待できる',
        '長期保有による資産形成に向いている場合も',
      ],
      cautions: [
        'ローン金利との差が小さく、キャッシュフローが薄くなりやすい',
        '空室・修繕費の増加でCFがマイナスになるリスクがある',
      ],
      suggestions: [
        'ローン・キャッシュフロー計算でキャッシュフローをシミュレーションしましょう',
        '頭金を増やしてローン返済額を抑えることも検討しましょう',
      ],
    };
  } else if (netYield >= 0) {
    return {
      grade: 'C',
      gradeLabel: '低い実質利回り',
      summary:
        '実質利回り2%未満はやや低い水準です。ローン金利との差がほとんどなく、キャッシュフローがマイナスになる可能性が高いです。',
      positives: ['立地や物件状態が良いエリアに多い', '長期的な資産価値の安定が期待できる場合も'],
      cautions: [
        'ローン金利との差がほとんどなく、収支がマイナスになりやすい',
        '月々の持ち出しに備えた余裕資金が必要',
      ],
      suggestions: [
        targetPropertyPrice !== null
          ? `実質利回り3%達成には物件価格を${targetPropertyPrice.toLocaleString()}万円以下にする必要があります`
          : '物件価格の値引き交渉を検討しましょう',
        targetMonthlyRent !== null
          ? `または月額家賃を${targetMonthlyRent}万円以上にできないか確認しましょう`
          : '家賃設定や空室率の改善を検討しましょう',
      ],
    };
  } else {
    return {
      grade: 'D',
      gradeLabel: '要改善',
      summary:
        '実質利回りがマイナスです。年間の経費が家賃収入を上回っており、購入しても毎年損失が出る状態です。条件を抜本的に見直す必要があります。',
      positives: [],
      cautions: [
        '年間経費が家賃収入を上回っており、購入すると毎年損失が発生する',
        'この状態でローンを組むと毎月の持ち出しが非常に大きくなる',
      ],
      suggestions: [
        '物件価格の大幅な値引き交渉か、購入を見合わせることを検討してください',
        '経費の内訳を見直し、削減できる項目がないか確認しましょう',
        '家賃の引き上げ余地がないか、賃貸需要を調査しましょう',
      ],
    };
  }
}

export default function NetYieldCalculator() {
  const [propertyPrice, setPropertyPrice] = useState<number | null>(null);
  const [monthlyRent, setMonthlyRent] = useState<number | null>(null);
  const [purchaseCost, setPurchaseCost] = useState<number>(0);
  const [annualManagementFee, setAnnualManagementFee] = useState<number>(0);
  const [annualRepairFund, setAnnualRepairFund] = useState<number>(0);
  const [annualPropertyTax, setAnnualPropertyTax] = useState<number>(0);
  const [annualInsurance, setAnnualInsurance] = useState<number>(0);
  const [vacancyRate, setVacancyRate] = useState<number>(10);
  const [otherExpenses, setOtherExpenses] = useState<number>(0);

  const result =
    propertyPrice !== null && monthlyRent !== null
      ? calcNetYield({
          propertyPrice,
          monthlyRent,
          purchaseCost,
          annualManagementFee,
          annualRepairFund,
          annualPropertyTax,
          annualInsurance,
          vacancyRate,
          otherExpenses,
        })
      : null;

  const annualRentFull = monthlyRent !== null ? monthlyRent * 12 : 0;

  // ④ 目標利回り3%達成に必要な数値（動的計算）
  const targetPropertyPrice =
    result !== null && result.annualNetIncome > 0
      ? Math.round(result.annualNetIncome / 0.03 - purchaseCost)
      : null;
  const targetMonthlyRent =
    result !== null && propertyPrice !== null
      ? Math.round(
          ((0.03 * result.totalInvestment + result.annualExpenses) /
            (12 * (1 - vacancyRate / 100))) *
            10,
        ) / 10
      : null;

  const advisorData =
    result !== null
      ? getAdvisorData(result.netYield, targetPropertyPrice, targetMonthlyRent)
      : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Intro */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
        <p className="text-sm text-blue-800 leading-relaxed">
          <strong>実質利回り</strong>（ネット利回り）とは、管理費・修繕費・税金・空室などの経費を差し引いた後の、より現実的な収益率です。
          表面利回りより<strong>2〜4%程度低くなる</strong>のが一般的で、
          実質利回りが<strong>3%以上</strong>あることが一つの目安とされています（地域・物件種別により異なります）。
        </p>
      </div>

      {/* How to use (collapsible) */}
      <HowToUseBox
        whatYouLearn={
          <p>
            管理費・修繕費・税金・空室率など実際にかかるコストを差し引いた
            <strong>「本当の収益率」</strong>を計算します。表面利回りとの差も一目でわかります。
          </p>
        }
        whenToUse={
          <p>
            気になる物件の表面利回りを確認した後、<strong>第2ステップ</strong>として使います。
            購入前の最終的な収益性チェックにも活用できます。
          </p>
        }
        inputGuide={
          <ul className="space-y-1.5">
            <li>
              <strong>物件価格・月額家賃：</strong>表面利回り計算と同じ値を入力してください
            </li>
            <li>
              <strong>購入諸費用：</strong>仲介手数料・登記費用・不動産取得税など（目安：物件価格の5〜8%）
            </li>
            <li>
              <strong>年間経費：</strong>管理費・修繕積立金・固定資産税（都市計画税含む）・火災保険料など
            </li>
            <li>
              <strong>空室率：</strong>年間の何%が空室かの想定。10〜20%（年1〜2ヶ月分）が一般的な目安
            </li>
          </ul>
        }
        resultGuide={
          <ul className="space-y-1.5">
            <li>
              <strong>実質利回り3%以上</strong>が一般的な目安
            </li>
            <li>表面利回りとの差が大きい場合は経費の見直しを検討</li>
            <li>ローン金利との差（イールドギャップ）が2%以上あることが望ましい</li>
          </ul>
        }
      />

      {/* Mobile: key result shown at top */}
      {result && (
        <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">表面利回り</p>
              <p className="text-2xl font-bold text-slate-600">{result.surfaceYield.toFixed(2)}%</p>
              <p className="text-xs text-slate-400">（経費なし）</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">実質利回り</p>
              <p
                className={`text-2xl font-bold ${
                  result.netYield >= 4
                    ? 'text-green-600'
                    : result.netYield >= 2
                      ? 'text-blue-600'
                      : result.netYield >= 0
                        ? 'text-amber-600'
                        : 'text-red-600'
                }`}
              >
                {result.netYield.toFixed(2)}%
              </p>
              <p className="text-xs text-slate-400">（経費込み）</p>
            </div>
          </div>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Input panel */}
        <div className="space-y-6">
          {/* Basic info */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">物件基本情報</h2>
            <InputField
              label="物件価格"
              value={propertyPrice}
              onChange={setPropertyPrice}
              unit="万円"
              min={1}
              step={50}
              placeholder="例：1500"
            />
            <InputField
              label="月額家賃収入（満室時）"
              value={monthlyRent}
              onChange={setMonthlyRent}
              unit="万円"
              min={0.1}
              step={0.5}
              placeholder="例：8.5"
            />
            <InputField
              label="購入諸費用"
              value={purchaseCost}
              onChange={setPurchaseCost}
              unit="万円"
              hint="仲介手数料・登記費用・不動産取得税など（目安：物件価格の5〜8%）"
              min={0}
              step={10}
              placeholder="例：90"
            />
          </div>

          {/* Annual expenses */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">年間経費</h2>
            <InputField
              label="管理費（年）"
              value={annualManagementFee}
              onChange={setAnnualManagementFee}
              unit="万円"
              hint="管理会社への委託費用（賃料の5〜10%程度）"
              min={0}
              step={1}
              placeholder="例：6"
            />
            <InputField
              label="修繕積立金（年）"
              value={annualRepairFund}
              onChange={setAnnualRepairFund}
              unit="万円"
              hint="区分マンションの場合は管理組合への積立金。戸建て・一棟の場合は将来の修繕に備えた積立"
              min={0}
              step={1}
              placeholder="例：3"
            />
            <InputField
              label="固定資産税（年）"
              value={annualPropertyTax}
              onChange={setAnnualPropertyTax}
              unit="万円"
              hint="市区町村から届く固定資産税・都市計画税の合計額"
              min={0}
              step={1}
              placeholder="例：10"
            />
            <InputField
              label="火災保険料（年）"
              value={annualInsurance}
              onChange={setAnnualInsurance}
              unit="万円"
              min={0}
              step={0.5}
              placeholder="例：2"
            />
            <InputField
              label="その他経費（年）"
              value={otherExpenses}
              onChange={setOtherExpenses}
              unit="万円"
              hint="広告費・入居者募集費用・原状回復費の積立など"
              min={0}
              step={1}
              placeholder="例：2"
            />
          </div>

          {/* Vacancy */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">空室率の設定</h2>
            <div className="mb-3">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>空室率</span>
                <span className="font-bold text-blue-600">{vacancyRate}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={5}
                value={vacancyRate}
                onChange={(e) => setVacancyRate(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0%（常に満室）</span>
                <span>50%</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              一般的な目安：10〜20%（年間で約1〜2ヶ月分の空室を想定）
            </p>
          </div>
        </div>

        {/* Result panel */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-20">
            <h2 className="text-lg font-semibold text-slate-800 mb-5">計算結果</h2>

            {result ? (
              <div>
                {/* Comparison */}
                <div className="grid grid-cols-2 gap-3 mb-5 p-4 bg-slate-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">表面利回り</p>
                    <p className="text-2xl font-bold text-slate-600">
                      {result.surfaceYield.toFixed(2)}%
                    </p>
                    <p className="text-xs text-slate-400">（経費なし）</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">実質利回り</p>
                    <p
                      className={`text-2xl font-bold ${
                        result.netYield >= 4
                          ? 'text-green-600'
                          : result.netYield >= 2
                            ? 'text-blue-600'
                            : result.netYield >= 0
                              ? 'text-amber-600'
                              : 'text-red-600'
                      }`}
                    >
                      {result.netYield.toFixed(2)}%
                    </p>
                    <p className="text-xs text-slate-400">（経費込み）</p>
                  </div>
                </div>

                <ResultCard
                  label="年間家賃収入（空室考慮後）"
                  value={result.annualRentWithVacancy.toFixed(1)}
                  unit="万円"
                  description={`満室時 ${annualRentFull.toFixed(1)}万円 × (1 − ${vacancyRate}%)`}
                />
                <ResultCard label="年間経費合計" value={result.annualExpenses.toFixed(1)} unit="万円" />
                <ResultCard
                  label="年間手取り収入"
                  value={result.annualNetIncome.toFixed(1)}
                  unit="万円"
                  description="家賃収入（空室後）から年間経費を引いた金額"
                  positive={result.annualNetIncome > 0}
                  negative={result.annualNetIncome <= 0}
                />
                <ResultCard
                  label="月間手取り収入"
                  value={result.monthlyNetIncome.toFixed(1)}
                  unit="万円"
                  highlight
                  positive={result.monthlyNetIncome > 0}
                  negative={result.monthlyNetIncome <= 0}
                />
                <ResultCard
                  label="投資総額（物件価格＋諸費用）"
                  value={result.totalInvestment.toFixed(0)}
                  unit="万円"
                />

                {/* ③ Tiered evaluation comment (4 tiers) */}
                <div className="mt-4 rounded-lg p-4 text-sm bg-slate-50">
                  {result.netYield >= 6 ? (
                    <p className="text-green-700">
                      🌟 実質利回り6%以上。非常に良好な水準です。ローン返済後のキャッシュフローも確認しましょう。
                    </p>
                  ) : result.netYield >= 4 ? (
                    <p className="text-green-700">
                      ✅ 実質利回り4〜6%。良好な水準です。適切なローン条件であればキャッシュフローをプラスに保てる可能性が高いです。
                    </p>
                  ) : result.netYield >= 2 ? (
                    <p className="text-blue-700">
                      ℹ️ 実質利回り2〜4%。標準的な水準です。都市部ではこの範囲が多く見られます。ローン金利との差に注意しましょう。
                    </p>
                  ) : result.netYield >= 0 ? (
                    <p className="text-amber-700">
                      ⚠️ 実質利回り2%未満。低い水準です。ローン金利との差がほとんどなく、キャッシュフローがマイナスになるリスクがあります。
                    </p>
                  ) : (
                    <p className="text-red-700">
                      ❌ 実質利回りがマイナスです。経費が家賃収入を上回っています。経費の見直しか、物件価格・家賃の再検討をおすすめします。
                    </p>
                  )}
                </div>

                {/* ④ Improvement suggestions (shown when net yield < 3%) */}
                {result.netYield < 3 && result.annualNetIncome > 0 && (
                  <div className="mt-3 rounded-lg p-4 bg-amber-50 border border-amber-200">
                    <p className="text-xs font-semibold text-amber-800 mb-2">
                      💡 利回り改善のための参考数値
                    </p>
                    <ul className="space-y-1.5">
                      {propertyPrice !== null && (
                        <li className="text-xs text-amber-800">
                          • 物件価格を10%値引き交渉できた場合の実質利回り：
                          <strong>
                            {' '}
                            {(
                              (result.annualNetIncome /
                                (propertyPrice * 0.9 + purchaseCost)) *
                              100
                            ).toFixed(2)}
                            %
                          </strong>
                        </li>
                      )}
                      {targetPropertyPrice !== null && targetPropertyPrice > 0 && (
                        <li className="text-xs text-amber-800">
                          • 実質利回り3%達成には物件価格を{' '}
                          <strong>{targetPropertyPrice.toLocaleString()}万円以下</strong>{' '}
                          にする必要があります
                        </li>
                      )}
                      {targetMonthlyRent !== null && (
                        <li className="text-xs text-amber-800">
                          • または月額家賃を{' '}
                          <strong>{targetMonthlyRent}万円以上</strong>{' '}
                          にできないか確認しましょう
                        </li>
                      )}
                      <li className="text-xs text-slate-600">
                        • 空室率を5%改善した場合の実質利回り：
                        <strong>
                          {' '}
                          {(
                            ((monthlyRent !== null
                              ? monthlyRent * 12 * (1 - Math.max(0, vacancyRate - 5) / 100)
                              : 0) -
                              result.annualExpenses) /
                            result.totalInvestment *
                            100
                          ).toFixed(2)}
                          %
                        </strong>
                      </li>
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

      <FormulaBox
        items={[
          {
            label: '実質利回りの計算式',
            formula:
              '実質利回り（%）＝（年間家賃収入×(1-空室率) − 年間経費）÷（物件価格 + 購入諸費用）× 100',
          },
          {
            label: '年間経費の内訳',
            formula: '年間経費 ＝ 管理費 ＋ 修繕積立金 ＋ 固定資産税 ＋ 火災保険料 ＋ その他',
          },
        ]}
      />

      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-5">
        <p className="text-sm font-semibold text-slate-700 mb-2">💡 次のステップ</p>
        <p className="text-sm text-slate-600">
          ローンを使って購入する場合は、毎月の返済後に手元に残るキャッシュフローも重要です。
          <a href="/tools/cashflow" className="text-blue-600 underline mx-1">
            ローン・キャッシュフロー計算
          </a>
          で確認しましょう。
        </p>
      </div>

      <Disclaimer />
    </div>
  );
}
