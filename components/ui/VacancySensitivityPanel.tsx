'use client';

// ── Types ────────────────────────────────────────────────────────────────────

interface VacancySensitivityPanelProps {
  monthlyRentFull: number;
  monthlyPayment: number;
  monthlyExpenses: number;
}

interface SimRow {
  vacancyRate: number;
  monthlyIncome: number;
  monthlyCF: number;
  annualCF: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildRows(
  monthlyRentFull: number,
  monthlyPayment: number,
  monthlyExpenses: number,
): SimRow[] {
  return Array.from({ length: 11 }, (_, i) => {
    const v = i * 10;
    const monthlyIncome = monthlyRentFull * (1 - v / 100);
    const monthlyCF = monthlyIncome - monthlyPayment - monthlyExpenses;
    return { vacancyRate: v, monthlyIncome, monthlyCF, annualCF: monthlyCF * 12 };
  });
}

function calcBreakEven(
  monthlyRentFull: number,
  monthlyPayment: number,
  monthlyExpenses: number,
): number | null {
  if (monthlyRentFull <= 0) return null;
  return (1 - (monthlyPayment + monthlyExpenses) / monthlyRentFull) * 100;
}

type SafetyLevel = 'safe' | 'caution' | 'warning' | 'danger' | 'always-negative';

function getSafetyLevel(breakEven: number | null): SafetyLevel {
  if (breakEven === null || breakEven <= 0) return 'always-negative';
  if (breakEven >= 30) return 'safe';
  if (breakEven >= 20) return 'caution';
  if (breakEven >= 10) return 'warning';
  return 'danger';
}

const SAFETY_CONFIG: Record<
  SafetyLevel,
  { label: string; description: string; textColor: string; bg: string; border: string }
> = {
  safe: {
    label: '✅ 安全圏',
    description: '空室リスクに十分なバッファがあります',
    textColor: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  caution: {
    label: '🔵 比較的安全',
    description: '一般的な空室率はカバーできます',
    textColor: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  warning: {
    label: '⚠️ 注意が必要',
    description: 'わずかな空室増加で赤字になります',
    textColor: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  danger: {
    label: '❌ 危険',
    description: 'ほぼ満室維持が前提の投資です',
    textColor: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  'always-negative': {
    label: '❌ 常に赤字',
    description: '満室でも月CFがマイナスです',
    textColor: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
};

// ── SVG Chart ─────────────────────────────────────────────────────────────────

const ML = 52; // left margin
const MR = 16;
const MT = 22;
const MB = 36;
const SW = 460;
const SH = 180;
const CW = SW - ML - MR;
const CH = SH - MT - MB;

function CfChart({
  rows,
  breakEven,
}: {
  rows: SimRow[];
  breakEven: number | null;
}) {
  const cfs = rows.map((r) => r.monthlyCF);
  const rawMax = Math.max(...cfs, 0);
  const rawMin = Math.min(...cfs, 0);

  // Add 10% padding to range
  const pad = ((rawMax - rawMin) || 1) * 0.12;
  const maxCF = rawMax + pad;
  const minCF = rawMin - pad;
  const range = maxCF - minCF;

  const xOf = (i: number) => ML + (i / 10) * CW;
  const yOf = (cf: number) => MT + (1 - (cf - minCF) / range) * CH;
  const zeroY = yOf(0);

  const inChart = (y: number) => y >= MT && y <= MT + CH;
  const linePoints = rows.map((r, i) => `${xOf(i).toFixed(1)},${yOf(r.monthlyCF).toFixed(1)}`).join(' ');

  // Break-even x position
  const beX =
    breakEven !== null && breakEven > 0 && breakEven < 100
      ? ML + (breakEven / 100) * CW
      : null;

  // Y-axis tick values
  const yTicks: number[] = [];
  const tickStep = (rawMax - rawMin) / 3 || 1;
  for (let i = 0; i <= 3; i++) {
    yTicks.push(rawMin + tickStep * i);
  }

  return (
    <svg viewBox={`0 0 ${SW} ${SH}`} className="w-full" style={{ maxHeight: 180 }}>
      {/* Green background (profitable zone) */}
      {inChart(zeroY) && (
        <rect
          x={ML}
          y={MT}
          width={CW}
          height={Math.max(0, zeroY - MT)}
          fill="#f0fdf4"
        />
      )}
      {rawMax > 0 && zeroY > MT + CH && (
        <rect x={ML} y={MT} width={CW} height={CH} fill="#f0fdf4" />
      )}

      {/* Red background (loss zone) */}
      {inChart(zeroY) && (
        <rect
          x={ML}
          y={Math.max(zeroY, MT)}
          width={CW}
          height={Math.max(0, MT + CH - zeroY)}
          fill="#fef2f2"
        />
      )}
      {rawMax <= 0 && (
        <rect x={ML} y={MT} width={CW} height={CH} fill="#fef2f2" />
      )}

      {/* Chart border */}
      <rect x={ML} y={MT} width={CW} height={CH} fill="none" stroke="#e2e8f0" strokeWidth={1} />

      {/* Zero line */}
      {inChart(zeroY) && (
        <line
          x1={ML}
          y1={zeroY}
          x2={ML + CW}
          y2={zeroY}
          stroke="#94a3b8"
          strokeWidth={1}
          strokeDasharray="4 3"
        />
      )}

      {/* Break-even vertical line */}
      {beX !== null && (
        <>
          <line
            x1={beX}
            y1={MT}
            x2={beX}
            y2={MT + CH}
            stroke="#f59e0b"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          <text x={beX} y={MT - 6} textAnchor="middle" fontSize={9} fill="#b45309" fontWeight="600">
            {breakEven?.toFixed(1)}%
          </text>
        </>
      )}

      {/* CF polyline */}
      <polyline
        points={linePoints}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Data points */}
      {rows.map((r, i) => (
        <circle
          key={i}
          cx={xOf(i)}
          cy={yOf(r.monthlyCF)}
          r={3.5}
          fill={r.monthlyCF >= 0 ? '#16a34a' : '#dc2626'}
          stroke="white"
          strokeWidth={1}
        />
      ))}

      {/* X axis labels (every 20%) */}
      {[0, 2, 4, 6, 8, 10].map((i) => (
        <text
          key={i}
          x={xOf(i)}
          y={MT + CH + 14}
          textAnchor="middle"
          fontSize={10}
          fill="#64748b"
        >
          {i * 10}%
        </text>
      ))}

      {/* X axis title */}
      <text
        x={ML + CW / 2}
        y={SH - 2}
        textAnchor="middle"
        fontSize={9}
        fill="#94a3b8"
      >
        空室率
      </text>

      {/* Y axis tick labels */}
      {yTicks.map((v, i) => {
        const y = yOf(v);
        if (!inChart(y)) return null;
        return (
          <text
            key={i}
            x={ML - 4}
            y={y + 3}
            textAnchor="end"
            fontSize={9}
            fill="#64748b"
          >
            {v >= 0 ? '+' : ''}{v.toFixed(1)}
          </text>
        );
      })}

      {/* Zero label */}
      {inChart(zeroY) && (
        <text
          x={ML - 4}
          y={zeroY + 3}
          textAnchor="end"
          fontSize={9}
          fill="#475569"
          fontWeight="700"
        >
          0
        </text>
      )}

      {/* Y axis title */}
      <text
        x={8}
        y={MT + CH / 2}
        textAnchor="middle"
        fontSize={9}
        fill="#94a3b8"
        transform={`rotate(-90, 8, ${MT + CH / 2})`}
      >
        万円/月
      </text>
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function VacancySensitivityPanel({
  monthlyRentFull,
  monthlyPayment,
  monthlyExpenses,
}: VacancySensitivityPanelProps) {
  const rows = buildRows(monthlyRentFull, monthlyPayment, monthlyExpenses);
  const breakEven = calcBreakEven(monthlyRentFull, monthlyPayment, monthlyExpenses);
  const safetyLevel = getSafetyLevel(breakEven);
  const safetyCfg = SAFETY_CONFIG[safetyLevel];

  const safetyMargin =
    breakEven !== null && breakEven > 0 ? breakEven - 10 : null;

  const firstNegativeIdx = rows.findIndex((r) => r.monthlyCF < 0);

  const breakEvenDisplay =
    breakEven === null
      ? '—'
      : breakEven <= 0
        ? '満室でも赤字'
        : breakEven >= 100
          ? '100%超（常に黒字）'
          : `${breakEven.toFixed(1)}%`;

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-base font-semibold text-slate-800 mb-1">📊 空室率シミュレーション</h2>
      <p className="text-xs text-slate-500 mb-5">
        月額家賃 <strong>{monthlyRentFull.toFixed(1)}万円</strong> を満室時として、空室率が変わると収益がどう変化するかを試算します
      </p>

      {/* ① Key metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">損益分岐空室率</p>
          <p className={`text-lg font-bold ${breakEven !== null && breakEven > 0 ? 'text-slate-800' : 'text-red-600'}`}>
            {breakEvenDisplay}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">これ以上で赤字に転じる</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">安全マージン</p>
          <p
            className={`text-lg font-bold ${
              safetyMargin !== null && safetyMargin >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {safetyMargin !== null
              ? `${safetyMargin >= 0 ? '+' : ''}${safetyMargin.toFixed(1)}%pt`
              : '—'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">一般目安10%との差</p>
        </div>

        <div className={`rounded-xl p-3 text-center border ${safetyCfg.bg} ${safetyCfg.border}`}>
          <p className="text-xs text-slate-500 mb-1">耐久力評価</p>
          <p className={`text-sm font-bold leading-tight ${safetyCfg.textColor}`}>
            {safetyCfg.label}
          </p>
          <p className={`text-xs mt-0.5 ${safetyCfg.textColor} opacity-80`}>
            {safetyCfg.description}
          </p>
        </div>
      </div>

      {/* ② Graph */}
      <div className="mb-6 bg-slate-50 rounded-xl p-3 pb-1">
        <p className="text-xs text-slate-500 text-center mb-1">
          空室率 × 月間キャッシュフロー（万円）
        </p>
        <CfChart rows={rows} breakEven={breakEven} />
        <div className="flex items-center justify-center gap-4 mt-1 mb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-slate-500">黒字</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-slate-500">赤字</span>
          </div>
          {breakEven !== null && breakEven > 0 && breakEven < 100 && (
            <div className="flex items-center gap-1.5">
              <svg width="18" height="10" className="overflow-visible">
                <line x1="0" y1="5" x2="18" y2="5" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
              </svg>
              <span className="text-xs text-slate-500">損益分岐</span>
            </div>
          )}
        </div>
      </div>

      {/* ③ Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="text-left py-2 px-2 text-xs font-semibold text-slate-500 w-16">空室率</th>
              <th className="text-right py-2 px-2 text-xs font-semibold text-slate-500">月間家賃収入</th>
              <th className="text-right py-2 px-2 text-xs font-semibold text-slate-500">月間CF</th>
              <th className="text-right py-2 px-2 text-xs font-semibold text-slate-500">年間CF</th>
              <th className="text-center py-2 px-2 text-xs font-semibold text-slate-500 w-10">状態</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isNegative = row.monthlyCF < 0;
              const isFirstNegative = i === firstNegativeIdx && firstNegativeIdx !== -1;
              const rowCls = [
                'border-b border-slate-100 transition-colors',
                isNegative ? 'bg-red-50' : 'bg-white',
                isFirstNegative ? 'border-t-2 border-t-amber-400' : '',
              ].join(' ');

              const cfColor = isNegative ? 'text-red-600 font-semibold' : row.monthlyCF >= 2 ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold';
              const icon = isNegative ? '❌' : row.monthlyCF >= 2 ? '✅' : '⚠️';

              return (
                <tr key={row.vacancyRate} className={rowCls}>
                  <td className="py-2 px-2 text-slate-700 font-medium">
                    {row.vacancyRate}%
                    {isFirstNegative && (
                      <span className="ml-1 text-xs bg-amber-100 text-amber-700 px-1 py-0.5 rounded whitespace-nowrap">
                        ←損益分岐
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-right text-slate-600">
                    {row.monthlyIncome.toFixed(1)}万円
                  </td>
                  <td className={`py-2 px-2 text-right ${cfColor}`}>
                    {row.monthlyCF >= 0 ? '+' : ''}{row.monthlyCF.toFixed(1)}万円
                  </td>
                  <td className={`py-2 px-2 text-right text-sm ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
                    {row.annualCF >= 0 ? '+' : ''}{row.annualCF.toFixed(0)}万円
                  </td>
                  <td className="py-2 px-2 text-center text-base">{icon}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Note */}
      <p className="mt-4 text-xs text-slate-400 leading-relaxed">
        ※ 月間家賃収入 ＝ 満室時家賃 × (1 − 空室率)。月間CF ＝ 月間家賃収入 − 月返済額 − 月間経費。
        損益分岐空室率はCFがゼロになる空室率を示します。一般的な空室率の目安は10〜20%程度です。
      </p>
    </div>
  );
}
