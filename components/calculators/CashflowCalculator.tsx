'use client';

import { useState, useEffect } from 'react';
import InputField from '@/components/ui/InputField';
import ResultCard from '@/components/ui/ResultCard';
import FormulaBox from '@/components/ui/FormulaBox';
import Disclaimer from '@/components/ui/Disclaimer';
import HowToUseBox from '@/components/ui/HowToUseBox';
import AdvisorCard, { AdvisorGrade } from '@/components/ui/AdvisorCard';
import PurchaseJudgmentCard from '@/components/ui/PurchaseJudgmentCard';
import VacancySensitivityPanel from '@/components/ui/VacancySensitivityPanel';
import { calcCashflow } from '@/lib/calculators/cashflow';
import { RepaymentType } from '@/types/calculator';
import { loadSharedProperty } from '@/lib/utils/sharedProperty';

const LOAN_YEAR_OPTIONS = [10, 15, 20, 25, 30, 35];

const GRADE_ORDER: AdvisorGrade[] = ['D', 'C', 'B', 'A', 'S'];

function gradeIndex(g: AdvisorGrade): number {
  return GRADE_ORDER.indexOf(g);
}

function rateNetYield(v: number): AdvisorGrade {
  if (v >= 5) return 'S';
  if (v >= 3) return 'A';
  if (v >= 2) return 'B';
  if (v >= 0) return 'C';
  return 'D';
}

function rateMonthlyCF(v: number): AdvisorGrade {
  if (v >= 3) return 'S';
  if (v >= 1) return 'A';
  if (v >= 0) return 'B';
  if (v >= -3) return 'C';
  return 'D';
}

function rateBreakEven(v: number | null): AdvisorGrade {
  if (v === null || v <= 0) return 'D';
  if (v >= 30) return 'S';
  if (v >= 20) return 'A';
  if (v >= 10) return 'B';
  return 'C';
}

function getPurchaseJudgment(
  netYield: number,
  monthlyCF: number,
  breakEven: number | null,
): { grade: AdvisorGrade; gradeLabel: string; reasons: string[] } {
  const nyGrade = rateNetYield(netYield);
  const cfGrade = rateMonthlyCF(monthlyCF);
  const beGrade = rateBreakEven(breakEven);
  const grade =
    GRADE_ORDER[Math.min(gradeIndex(nyGrade), gradeIndex(cfGrade), gradeIndex(beGrade))];

  const GRADE_LABELS: Record<AdvisorGrade, string> = {
    S: '非常に優秀な投資条件',
    A: '良好な投資条件',
    B: '概ね問題ない条件',
    C: '条件の改善を検討',
    D: '投資条件の見直しが必要',
  };

  const cfText = `${monthlyCF >= 0 ? '+' : ''}${monthlyCF.toFixed(1)}万円/月`;
  const breakEvenText =
    breakEven === null || breakEven <= 0 ? '満室でも赤字' : `${breakEven.toFixed(1)}%`;

  const nyReasonMap: Record<AdvisorGrade, string> = {
    S: `実質利回り${netYield.toFixed(2)}%は非常に高い水準で、十分な収益性が期待できます`,
    A: `実質利回り${netYield.toFixed(2)}%は良好な水準で、安定した収益が見込めます`,
    B: `実質利回り${netYield.toFixed(2)}%は標準的な水準ですが、ローン金利との差は小さめです`,
    C: `実質利回り${netYield.toFixed(2)}%は低く、費用の圧迫が懸念されます`,
    D: `実質利回り${netYield.toFixed(2)}%はマイナスで、経費が家賃収入を上回っています`,
  };
  const cfReasonMap: Record<AdvisorGrade, string> = {
    S: `月間CF${cfText}と十分なプラスで、空室・修繕費への余裕があります`,
    A: `月間CF${cfText}で良好なキャッシュフローが確保できています`,
    B: `月間CF${cfText}のプラスを確保していますが、緊急時の手元資金が重要です`,
    C: `月間CF${cfText}のマイナスで、毎月の持ち出しが発生します`,
    D: `月間CF${cfText}の大きなマイナスで、収支改善が急務です`,
  };
  const beReasonMap: Record<AdvisorGrade, string> = {
    S: `損益分岐空室率${breakEvenText}と高く、空室リスクへの耐性が十分あります`,
    A: `損益分岐空室率${breakEvenText}で、一般的な空室率を十分にカバーできます`,
    B: `損益分岐空室率${breakEvenText}で、一般目安の10%付近です`,
    C: `損益分岐空室率${breakEvenText}と低く、ほぼ満室維持が前提となります`,
    D:
      breakEven !== null && breakEven > 0
        ? `損益分岐空室率${breakEvenText}と極めて低く、わずかな空室で赤字になります`
        : `損益分岐空室率が0%以下で、満室でも毎月赤字です`,
  };

  return {
    grade,
    gradeLabel: GRADE_LABELS[grade],
    reasons: [nyReasonMap[nyGrade], cfReasonMap[cfGrade], beReasonMap[beGrade]],
  };
}

function getAdvisorData(
  monthlyCF: number,
  cfYield: number,
  scenarioCF35yr: number | null,
  scenarioCFMore200: number | null,
  scenarioCFLowerRate: number | null,
  loanYears: number,
  interestRate: number,
  downPayment: number,
): {
  grade: AdvisorGrade;
  gradeLabel: string;
  summary: string;
  positives: string[];
  cautions: string[];
  suggestions: string[];
} {
  if (monthlyCF >= 5) {
    return {
      grade: 'S',
      gradeLabel: '非常に余裕のあるCF',
      summary:
        `月間キャッシュフローが${monthlyCF.toFixed(1)}万円のプラスです。空室や修繕費が発生しても余裕を持って対応できる水準です。`,
      positives: [
        '毎月の収益が十分にあり、空室リスクへの耐性が高い',
        `自己資金利回りも${cfYield.toFixed(1)}%と良好`,
        '複数物件への展開を検討できる安定した収益基盤',
      ],
      cautions: [
        '将来の金利上昇（変動金利の場合）には引き続き注意',
        '大規模修繕が発生した場合の対応資金を確保しておくこと',
      ],
      suggestions: [
        '余剰キャッシュを繰上返済や次の物件購入資金として活用できます',
        '長期シミュレーションで資産形成のゴールを描いてみましょう',
      ],
    };
  } else if (monthlyCF >= 2) {
    return {
      grade: 'A',
      gradeLabel: '良好なCF',
      summary:
        `月間キャッシュフローが${monthlyCF.toFixed(1)}万円のプラスです。良好な水準で、安定した不動産投資が期待できます。`,
      positives: [
        '毎月の収益がプラスで安定した収支',
        '空室1〜2ヶ月程度であれば持ち堪えられる水準',
      ],
      cautions: [
        '空室率が上昇した場合にCFが薄くなる可能性がある',
        '変動金利の場合は将来の金利上昇リスクを想定しておく',
      ],
      suggestions: [
        '緊急修繕に備えた手元流動性（家賃6ヶ月分程度）を確保しましょう',
        '金利が1%上昇した場合のCFも確認しておくことをおすすめします',
      ],
    };
  } else if (monthlyCF >= 0) {
    return {
      grade: 'B',
      gradeLabel: 'プラスだが薄いCF',
      summary:
        `月間キャッシュフローが${monthlyCF.toFixed(1)}万円のプラスです。収支はプラスですが、空室や修繕費の発生でマイナスに転じる可能性があります。`,
      positives: ['毎月の収支はプラスを維持', '長期保有で資産形成が期待できる'],
      cautions: [
        '空室や修繕費でCFがすぐにマイナスになるリスクがある',
        '手元に余裕資金を十分に確保しておくことが重要',
        '変動金利の場合は金利上昇リスクに特に注意',
      ],
      suggestions: [
        '緊急時の備えとして家賃収入の6〜12ヶ月分を手元資金として確保しましょう',
        '繰上返済や追加の頭金投入でCFを改善することも検討を',
      ],
    };
  } else if (monthlyCF >= -3) {
    return {
      grade: 'C',
      gradeLabel: 'CFがマイナス',
      summary:
        `毎月${Math.abs(monthlyCF).toFixed(1)}万円の持ち出しが発生しています。条件の見直しを検討しましょう。`,
      positives: ['物件の立地・資産価値が高いエリアに多い状況', '長期保有でのキャピタルゲインが期待できる場合も'],
      cautions: [
        `毎月${Math.abs(monthlyCF).toFixed(1)}万円の持ち出しが続く`,
        '空室が発生するとさらに負担が増える',
        '長期の持ち出しに耐えられる財務体力が必要',
      ],
      suggestions: [
        scenarioCFMore200 !== null
          ? `頭金を200万円追加すると月間CFが${scenarioCFMore200.toFixed(1)}万円になります`
          : '頭金を増やしてローン返済額を抑えることを検討しましょう',
        loanYears < 35 && scenarioCF35yr !== null
          ? `返済期間を35年に延ばすと月間CFが${scenarioCF35yr.toFixed(1)}万円になります`
          : '返済期間の延長で月返済額を抑えることも一つの手段です',
        scenarioCFLowerRate !== null
          ? `金利が${(interestRate - 0.5).toFixed(1)}%に下がると月間CFが${scenarioCFLowerRate.toFixed(1)}万円になります（金利交渉の参考に）`
          : '金融機関との金利交渉も検討しましょう',
      ],
    };
  } else {
    return {
      grade: 'D',
      gradeLabel: '大きなマイナスCF',
      summary:
        `毎月${Math.abs(monthlyCF).toFixed(1)}万円の持ち出しが発生しています。購入条件を抜本的に見直す必要があります。`,
      positives: [],
      cautions: [
        `毎月${Math.abs(monthlyCF).toFixed(1)}万円の大きな持ち出しが続く`,
        `年間では${(Math.abs(monthlyCF) * 12).toFixed(0)}万円以上の損失`,
        '空室・修繕費が重なると資金繰りが非常に厳しくなる',
      ],
      suggestions: [
        '物件価格の大幅な値引き交渉か、購入を見合わせることを強くおすすめします',
        scenarioCFMore200 !== null
          ? `頭金を200万円追加した場合：月間CF ${scenarioCFMore200.toFixed(1)}万円`
          : '頭金を大幅に増やすことで改善できる可能性があります',
        loanYears < 35 && scenarioCF35yr !== null
          ? `返済期間を35年にした場合：月間CF ${scenarioCF35yr.toFixed(1)}万円`
          : '返済期間の最大延長も検討しましょう',
      ],
    };
  }
}

export default function CashflowCalculator() {
  // #2: 満室時家賃と空室率を分離して入力
  const [monthlyRentFull, setMonthlyRentFull] = useState<number | null>(null);
  const [vacancyRate, setVacancyRate] = useState<number>(0);
  const [propertyPrice, setPropertyPrice] = useState<number | null>(null);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(1.5);
  const [loanYears, setLoanYears] = useState<number>(20);
  const [repaymentType, setRepaymentType] = useState<RepaymentType>('equal-installment');
  const [annualExpenses, setAnnualExpenses] = useState<number>(0);
  // #3: 購入諸費用
  const [purchaseCosts, setPurchaseCosts] = useState<number>(0);

  // #9: 表面利回りページの入力値をlocalStorageから引き継ぐ
  useEffect(() => {
    const saved = loadSharedProperty();
    if (saved.propertyPrice !== undefined && propertyPrice === null) {
      setPropertyPrice(saved.propertyPrice);
    }
    if (saved.monthlyRentFull !== undefined && monthlyRentFull === null) {
      setMonthlyRentFull(saved.monthlyRentFull);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // #2: 空室を考慮した実際の月間家賃収入
  const effectiveMonthlyRent =
    monthlyRentFull !== null ? monthlyRentFull * (1 - vacancyRate / 100) : null;

  const inputs = {
    propertyPrice: propertyPrice ?? 0,
    downPayment,
    interestRate,
    loanYears,
    repaymentType,
    monthlyRent: effectiveMonthlyRent ?? 0,
    annualExpenses,
    purchaseCosts,
  };

  const result =
    propertyPrice !== null && monthlyRentFull !== null
      ? calcCashflow(inputs)
      : null;

  const loanAmount = propertyPrice !== null ? Math.max(0, propertyPrice - downPayment) : 0;

  // シナリオ計算（CF改善の参考値）
  const scenarioCF35yr =
    result !== null && loanYears < 35 && propertyPrice !== null && monthlyRentFull !== null
      ? calcCashflow({ ...inputs, loanYears: 35 })?.monthlyCashflow ?? null
      : null;

  const scenarioCFMore200 =
    result !== null && propertyPrice !== null && monthlyRentFull !== null
      ? calcCashflow({ ...inputs, downPayment: downPayment + 200 })?.monthlyCashflow ?? null
      : null;

  const scenarioCFLowerRate =
    result !== null && interestRate > 0.5 && propertyPrice !== null && monthlyRentFull !== null
      ? calcCashflow({ ...inputs, interestRate: interestRate - 0.5 })?.monthlyCashflow ?? null
      : null;

  const advisorData =
    result !== null
      ? getAdvisorData(
          result.monthlyCashflow,
          result.cashflowYield,
          scenarioCF35yr,
          scenarioCFMore200,
          scenarioCFLowerRate,
          loanYears,
          interestRate,
          downPayment,
        )
      : null;

  const netYield =
    propertyPrice !== null &&
    monthlyRentFull !== null &&
    propertyPrice + purchaseCosts > 0
      ? ((monthlyRentFull * 12 * (1 - vacancyRate / 100) - annualExpenses) /
          (propertyPrice + purchaseCosts)) *
        100
      : null;

  const yieldGap = netYield !== null ? netYield - interestRate : null;

  const breakEven =
    result !== null && monthlyRentFull !== null && monthlyRentFull > 0
      ? (1 - (result.monthlyPayment + result.monthlyExpenses) / monthlyRentFull) * 100
      : null;

  const purchaseJudgment =
    result !== null && netYield !== null
      ? getPurchaseJudgment(netYield, result.monthlyCashflow, breakEven)
      : null;

  // #3: 自己資金利回りの説明文
  const equityDescription = () => {
    const base = downPayment > 0 ? `頭金${downPayment}万円` : '物件価格';
    if (purchaseCosts > 0) {
      return `年間CF ÷ (${base} + 諸費用${purchaseCosts}万円) × 100`;
    }
    return `年間CF ÷ ${base} × 100`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Intro */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
        <p className="text-sm text-blue-800 leading-relaxed">
          <strong>キャッシュフロー（CF）</strong>とは、家賃収入からローン返済・経費をすべて引いた後の<strong>手取り収益</strong>です。
          CFがプラスであれば毎月お金が手元に残り、マイナスであれば毎月の持ち出しが発生します。
          不動産投資では「毎月のCFがプラスで回る」ことが健全な運営の基本とされています。
        </p>
      </div>

      {/* How to use (collapsible) */}
      <HowToUseBox
        whatYouLearn={
          <p>
            ローン返済額・経費をすべて差し引いた後の
            <strong>「毎月の手取り金額」</strong>を計算します。
            利回りだけでは見えない、実際の月々の収支を把握できます。
          </p>
        }
        whenToUse={
          <p>
            実質利回りを確認した後、<strong>第3ステップ</strong>として使います。
            ローンの条件（頭金・金利・期間）を変えながら最適な組み合わせを探すのにも活用できます。
          </p>
        }
        inputGuide={
          <ul className="space-y-1.5">
            <li>
              <strong>物件価格・満室時家賃：</strong>これまでの計算と同じ値を入力してください。前のページで入力済みなら自動的に入ります
            </li>
            <li>
              <strong>空室率：</strong>想定する空室率（%）を入力。0%なら常に満室、10%なら年間約1ヶ月空室の想定
            </li>
            <li>
              <strong>購入諸費用：</strong>仲介手数料・登記費用・不動産取得税など（目安：物件価格の5〜8%）。自己資金利回りに反映されます
            </li>
            <li>
              <strong>頭金：</strong>自己資金から充てる金額。残りが借入金額になります
            </li>
            <li>
              <strong>金利（年率）：</strong>金融機関から提示された金利。変動金利の目安は0.5〜2%程度
            </li>
          </ul>
        }
        resultGuide={
          <ul className="space-y-1.5">
            <li>
              <strong>月間CFがプラス</strong>であれば、毎月お金が残る健全な状態です
            </li>
            <li>マイナスの場合は毎月の持ち出しが発生します</li>
            <li>
              <strong>自己資金利回り</strong>は、自己資金（頭金＋購入諸費用）に対して年間CFが何%かを示す指標です
            </li>
            <li>条件を変えながら「CFがゼロになる頭金」を探すのも有効です</li>
          </ul>
        }
      />

      {/* Mobile: key result shown at top */}
      {result && (
        <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <p className="text-xs text-slate-500 mb-2">月間キャッシュフロー（概算）</p>
          <p
            className={`text-3xl font-bold ${
              result.monthlyCashflow >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {result.monthlyCashflow >= 0 ? '+' : ''}
            {result.monthlyCashflow.toFixed(1)}
            <span className="text-base font-normal ml-1">万円/月</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {result.monthlyCashflow >= 0 ? '毎月手元に残る金額' : '毎月の持ち出し金額'}
          </p>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Input panel */}
        <div className="space-y-6">
          {/* Property */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">物件情報</h2>
            <InputField
              label="物件価格"
              value={propertyPrice}
              onChange={setPropertyPrice}
              unit="万円"
              min={1}
              step={50}
              placeholder="例：1500"
            />

            {/* #2: 満室時家賃と空室率 */}
            <InputField
              label="満室時月額家賃収入"
              value={monthlyRentFull}
              onChange={setMonthlyRentFull}
              unit="万円"
              hint="入居者が全員いる満室想定の家賃合計"
              min={0}
              step={0.5}
              placeholder="例：8.5"
            />
            <InputField
              label="想定空室率"
              value={vacancyRate}
              onChange={setVacancyRate}
              unit="%"
              hint="年間を通じて何%空室かの想定。一般的な目安は5〜10%"
              min={0}
              max={100}
              step={1}
              placeholder="例：5"
            />
            {monthlyRentFull !== null && (
              <div className="mb-4 bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-700">
                実際の月間家賃収入：
                <strong>{effectiveMonthlyRent!.toFixed(1)}万円</strong>
                <span className="text-xs text-blue-500 ml-2">
                  （満室時 {monthlyRentFull}万円 × {100 - vacancyRate}%）
                </span>
              </div>
            )}

            <InputField
              label="年間経費合計"
              value={annualExpenses}
              onChange={setAnnualExpenses}
              unit="万円"
              hint="管理費・修繕積立・税金・保険など。実質利回り計算で求めた経費合計を参考にしてください"
              min={0}
              step={1}
              placeholder="例：30"
            />

            {/* #3: 購入諸費用 */}
            <InputField
              label="購入諸費用"
              value={purchaseCosts}
              onChange={setPurchaseCosts}
              unit="万円"
              hint="仲介手数料・登記費用・不動産取得税など（目安：物件価格の5〜8%）。自己資金利回りの計算に使います"
              min={0}
              step={10}
              placeholder="例：90"
            />
          </div>

          {/* Loan */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">ローン条件</h2>
            <InputField
              label="頭金"
              value={downPayment}
              onChange={setDownPayment}
              unit="万円"
              hint="自己資金から充てる金額（0円の場合はフルローン）"
              min={0}
              step={50}
              placeholder="例：300"
            />
            {propertyPrice !== null && (
              <div className="mb-4 bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-700">
                借入金額：<strong>{loanAmount.toFixed(0)}万円</strong>
                <span className="text-xs text-blue-500 ml-2">
                  （物件価格 {propertyPrice}万円 − 頭金 {downPayment}万円）
                </span>
              </div>
            )}
            <InputField
              label="金利（年率）"
              value={interestRate}
              onChange={setInterestRate}
              unit="%"
              hint="金融機関から提示された金利（変動金利の目安：0.5〜2%）"
              min={0}
              max={20}
              step={0.1}
              placeholder="例：1.5"
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">返済期間</label>
              <select
                value={loanYears}
                onChange={(e) => setLoanYears(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LOAN_YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}年
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">返済方式</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="repaymentType"
                    value="equal-installment"
                    checked={repaymentType === 'equal-installment'}
                    onChange={() => setRepaymentType('equal-installment')}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">元利均等返済</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="repaymentType"
                    value="equal-principal"
                    checked={repaymentType === 'equal-principal'}
                    onChange={() => setRepaymentType('equal-principal')}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">元金均等返済</span>
                </label>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {repaymentType === 'equal-installment'
                  ? '毎月の返済額が一定のため、資金計画を立てやすい返済方式です。'
                  : '返済が進むにつれて月々の返済額が減っていく方式です。総支払利息は元利均等より少なくなります。※初月の返済額を表示しています。'}
              </p>
            </div>
          </div>
        </div>

        {/* Result panel */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-20">
            <h2 className="text-lg font-semibold text-slate-800 mb-5">計算結果</h2>

            {result ? (
              <div>
                {/* CF highlight */}
                <div
                  className={`rounded-xl p-5 mb-5 text-center ${
                    result.monthlyCashflow >= 0
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <p className="text-sm text-slate-600 mb-1">月間キャッシュフロー</p>
                  <p
                    className={`text-4xl font-bold ${
                      result.monthlyCashflow >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {result.monthlyCashflow >= 0 ? '+' : ''}
                    {result.monthlyCashflow.toFixed(1)}
                    <span className="text-lg font-normal ml-1">万円/月</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {result.monthlyCashflow >= 0
                      ? '毎月この金額が手元に残ります'
                      : '毎月この金額の持ち出しが発生します'}
                  </p>
                </div>

                <ResultCard
                  label="月返済額"
                  value={result.monthlyPayment.toFixed(1)}
                  unit="万円"
                  description={
                    repaymentType === 'equal-principal' ? '※元金均等の場合は初月額' : ''
                  }
                />
                <ResultCard
                  label="月間経費"
                  value={result.monthlyExpenses.toFixed(1)}
                  unit="万円"
                  description="年間経費 ÷ 12"
                />
                <ResultCard
                  label="年間キャッシュフロー"
                  value={`${result.annualCashflow >= 0 ? '+' : ''}${result.annualCashflow.toFixed(1)}`}
                  unit="万円"
                  positive={result.annualCashflow >= 0}
                  negative={result.annualCashflow < 0}
                />
                <ResultCard
                  label="自己資金利回り（CF利回り）"
                  value={result.cashflowYield.toFixed(2)}
                  unit="%"
                  description={equityDescription()}
                  highlight
                />
                <div className="border-t border-slate-100 mt-4 pt-4">
                  <ResultCard label="返済総額" value={result.totalPayment.toFixed(0)} unit="万円" />
                  <ResultCard
                    label="総支払利息"
                    value={result.totalInterest.toFixed(0)}
                    unit="万円"
                    description="返済総額 − 借入金額"
                  />
                </div>

                {/* イールドギャップ */}
                {yieldGap !== null && netYield !== null && (
                  <div className="border-t border-slate-100 mt-4 pt-4">
                    <div className="py-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm text-slate-600 shrink-0">イールドギャップ</span>
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`font-bold text-xl ${
                              yieldGap >= 3
                                ? 'text-green-600'
                                : yieldGap >= 2
                                  ? 'text-blue-600'
                                  : 'text-amber-600'
                            }`}
                          >
                            {yieldGap >= 0 ? '+' : ''}
                            {yieldGap.toFixed(2)}%
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              yieldGap >= 3
                                ? 'bg-green-100 text-green-700'
                                : yieldGap >= 2
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {yieldGap >= 3 ? '良好' : yieldGap >= 2 ? '普通' : '注意'}
                          </span>
                        </div>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        実質利回り{netYield.toFixed(2)}% − 借入金利{interestRate}% ／ 2%以上が目安
                      </p>
                    </div>
                  </div>
                )}

                {/* Tiered evaluation comment */}
                <div className="mt-4 rounded-lg p-4 text-sm bg-slate-50">
                  {result.monthlyCashflow >= 5 ? (
                    <p className="text-green-700">
                      🌟 月間CF{result.monthlyCashflow.toFixed(1)}万円。非常に余裕のある投資です。空室や修繕費にも十分対応できる水準です。
                    </p>
                  ) : result.monthlyCashflow >= 2 ? (
                    <p className="text-green-700">
                      ✅ 月間CF{result.monthlyCashflow.toFixed(1)}万円。良好な水準です。
                    </p>
                  ) : result.monthlyCashflow >= 0 ? (
                    <p className="text-blue-700">
                      ℹ️ CFはプラスですが薄め。空室や修繕費の発生に備えた手元資金を確保しておきましょう。
                    </p>
                  ) : result.monthlyCashflow >= -3 ? (
                    <p className="text-amber-700">
                      ⚠️ 毎月{Math.abs(result.monthlyCashflow).toFixed(1)}万円の持ち出しが発生します。頭金の増額や返済期間の延長を検討してください。
                    </p>
                  ) : (
                    <p className="text-red-700">
                      ❌ 毎月{Math.abs(result.monthlyCashflow).toFixed(1)}万円の大きな持ち出しです。購入条件を抜本的に見直すことをおすすめします。
                    </p>
                  )}
                </div>

                {/* CF improvement suggestions */}
                {result.monthlyCashflow < 0 && (
                  <div className="mt-3 rounded-lg p-4 bg-amber-50 border border-amber-200">
                    <p className="text-xs font-semibold text-amber-800 mb-2">
                      💡 CF改善のための参考シナリオ
                    </p>
                    <ul className="space-y-1.5">
                      {scenarioCFMore200 !== null && (
                        <li className="text-xs text-amber-800">
                          • 頭金を200万円増やした場合：月間CF{' '}
                          <strong>
                            {scenarioCFMore200 >= 0 ? '+' : ''}
                            {scenarioCFMore200.toFixed(1)}万円
                          </strong>
                        </li>
                      )}
                      {loanYears < 35 && scenarioCF35yr !== null && (
                        <li className="text-xs text-amber-800">
                          • 返済期間を35年に延ばした場合：月間CF{' '}
                          <strong>
                            {scenarioCF35yr >= 0 ? '+' : ''}
                            {scenarioCF35yr.toFixed(1)}万円
                          </strong>
                        </li>
                      )}
                      {interestRate > 0.5 && scenarioCFLowerRate !== null && (
                        <li className="text-xs text-amber-800">
                          • 金利が{(interestRate - 0.5).toFixed(1)}%になった場合：月間CF{' '}
                          <strong>
                            {scenarioCFLowerRate >= 0 ? '+' : ''}
                            {scenarioCFLowerRate.toFixed(1)}万円
                          </strong>
                          （金利交渉の参考に）
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* 購入判定 */}
                {purchaseJudgment && <PurchaseJudgmentCard {...purchaseJudgment} />}

                {/* AI advisor card */}
                {advisorData && <AdvisorCard {...advisorData} />}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-400">
                <div className="text-center">
                  <p className="text-4xl mb-3">📊</p>
                  <p className="text-sm">
                    条件を入力すると
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
      {result !== null && monthlyRentFull !== null && (
        <VacancySensitivityPanel
          monthlyRentFull={monthlyRentFull}
          monthlyPayment={result.monthlyPayment}
          monthlyExpenses={result.monthlyExpenses}
        />
      )}

      <FormulaBox
        items={[
          {
            label: '月間キャッシュフロー',
            formula: '月間CF ＝ 実際の月額家賃収入 − 月返済額 − 月間経費（年間経費 ÷ 12）',
          },
          {
            label: '実際の月額家賃収入',
            formula: '実際の月額家賃 ＝ 満室時家賃 × (1 − 空室率)',
          },
          {
            label: '元利均等返済の月返済額',
            formula:
              '月返済額 ＝ 借入金額 × 月利 × (1+月利)^返済月数 ÷ ((1+月利)^返済月数 − 1)',
          },
          {
            label: '自己資金利回り（CF利回り）',
            formula: '自己資金利回り（%）＝ 年間CF ÷ (頭金 + 購入諸費用) × 100',
            example: 'レバレッジ効果を測る指標。自己資金に対して何%のリターンかを示す',
          },
        ]}
      />

      <Disclaimer />
    </div>
  );
}
