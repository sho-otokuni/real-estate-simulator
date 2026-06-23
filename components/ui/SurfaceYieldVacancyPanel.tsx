'use client';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SurfaceYieldVacancyPanelProps {
  propertyPrice: number;
  monthlyRentFull: number;
}

interface SimRow {
  vacancyRate: number;
  monthlyIncome: number;
  annualIncome: number;
  surfaceYield: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildRows(propertyPrice: number, monthlyRentFull: number): SimRow[] {
  return Array.from({ length: 11 }, (_, i) => {
    const v = i * 10;
    const monthlyIncome = monthlyRentFull * (1 - v / 100);
    const annualIncome = monthlyIncome * 12;
    const surfaceYield = propertyPrice > 0 ? (annualIncome / propertyPrice) * 100 : 0;
    return { vacancyRate: v, monthlyIncome, annualIncome, surfaceYield };
  });
}

// 目標利回りを維持できる最大空室率
function maxVacancyFor(
  targetYield: number,
  propertyPrice: number,
  monthlyRentFull: number,
): number {
  if (monthlyRentFull <= 0) return 0;
  return (1 - (targetYield * propertyPrice) / (monthlyRentFull * 1200)) * 100;
}

type SafetyLevel = 'excellent' | 'good' | 'caution' | 'warning' | 'danger';

function getSafetyLevel(maxVacancy5: number): SafetyLevel {
  if (maxVacancy5 >= 40) return 'excellent';
  if (maxVacancy5 >= 25) return 'good';
  if (maxVacancy5 >= 15) return 'caution';
  if (maxVacancy5 >= 5) return 'warning';
  return 'danger';
}

const SAFETY_CONFIG: Record<
  SafetyLevel,
  { label: string; description: string; textColor: string; bg: string; border: string }
> = {
  excellent: {
    label: '✅ 非常に余裕あり',
    description: '高利回りで空室耐性が高い物件です',
    textColor: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  good: {
    label: '✅ 余裕あり',
    description: '一般的な空室リスクを十分カバーします',
    textColor: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  caution: {
    label: '⚠️ 注意が必要',
    description: 'やや空室に対する余裕が少ない水準です',
    textColor: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  warning: {
    label: '❌ 余裕が少ない',
    description: 'ほぼ満室前提でないと5%を維持できません',
    textColor: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  danger: {
    label: '❌ 既に5%未満',
    description: '満室でも表面利回りが5%を下回っています',
    textColor: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
};

// ── Row status ────────────────────────────────────────────────────────────────

function rowStatus(y: number): { icon: string; color: string; bg: string } {
  if (y >= 10) return { icon: '🌟', color: 'text-green-600', bg: '' };
  if (y >= 7) return { icon: '✅', color: 'text-green-600', bg: '' };
  if (y >= 5) return { icon: '⚠️', color: 'text-amber-600', bg: 'bg-amber-50' };
  if (y >= 3) return { icon: '🔵', color: 'text-blue-600', bg: 'bg-blue-50' };
  return { icon: '❌', color: 'text-red-600', bg: 'bg-red-50' };
}

// ── SVG Chart ─────────────────────────────────────────────────────────────────

const ML = 52;
const MR = 16;
const MT = 22;
const MB = 36;
const SW = 460;
const SH = 180;
const CW = SW - ML - MR;
const CH = SH - MT - MB;

const YIELD_REFS = [
  { value: 3, label: '3%', color: '#ef4444', dash: '3 3' },
  { value: 5, label: '5%', color: '#f59e0b', dash: '4 3' },
  { value: 7, label: '7%', color: '#22c55e', dash: '4 3' },
  { value: 10, label: '10%', color: '#3b82f6', dash: '4 3' },
];

function YieldChart({ rows }: { rows: SimRow[] }) {
  const yields = rows.map((r) => r.surfaceYield);
  const rawMax = Math.max(...yields, 10);
  const rawMin = 0;
  const pad = rawMax * 0.12;
  const maxY = rawMax + pad;
  const minY = rawMin;
  const range = maxY - minY || 1;

  const xOf = (i: number) => ML + (i / 10) * CW;
  const yOf = (val: number) => MT + (1 - (val - minY) / range) * CH;
  const inChart = (y: number) => y >= MT && y <= MT + CH;

  const linePoints = rows.map((r, i) => `${xOf(i).toFixed(1)},${yOf(r.surfaceYield).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${SW} ${SH}`} className="w-full" style={{ maxHeight: 180 }}>
      {/* Background */}
      <rect x={ML} y={MT} width={CW} height={CH} fill="#f8fafc" />
      <rect x={ML} y={MT} width={CW} height={CH} fill="none" stroke="#e2e8f0" strokeWidth={1} />

      {/* Yield reference lines */}
      {YIELD_REFS.map((ref) => {
        const ry = yOf(ref.value);
        if (!inChart(ry)) return null;
        return (
          <g key={ref.value}>
            <line
              x1={ML}
              y1={ry}
              x2={ML + CW}
              y2={ry}
              stroke={ref.color}
              strokeWidth={1}
              strokeDasharray={ref.dash}
              opacity={0.7}
            />
            <text
              x={ML + CW + 3}
              y={ry + 3}
              fontSize={8}
              fill={ref.color}
              fontWeight="600"
            >
              {ref.label}
            </text>
          </g>
        );
      })}

      {/* Yield polyline */}
      <polyline
        points={linePoints}
        fill="none"
        stroke="#6366f1"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Data points */}
      {rows.map((r, i) => {
        const st = rowStatus(r.surfaceYield);
        const fill = r.surfaceYield >= 7 ? '#16a34a' : r.surfaceYield >= 5 ? '#f59e0b' : '#ef4444';
        return (
          <circle
            key={i}
            cx={xOf(i)}
            cy={yOf(r.surfaceYield)}
            r={3.5}
            fill={fill}
            stroke="white"
            strokeWidth={1}
          />
        );
      })}

      {/* X axis labels */}
      {[0, 2, 4, 6, 8, 10].map((i) => (
        <text key={i} x={xOf(i)} y={MT + CH + 14} textAnchor="middle" fontSize={10} fill="#64748b">
          {i * 10}%
        </text>
      ))}
      <text x={ML + CW / 2} y={SH - 2} textAnchor="middle" fontSize={9} fill="#94a3b8">
        空室率
      </text>

      {/* Y axis labels */}
      {[0, Math.round(rawMax / 2), Math.round(rawMax)].map((v, i) => {
        const y = yOf(v);
        if (!inChart(y)) return null;
        return (
          <text key={i} x={ML - 4} y={y + 3} textAnchor="end" fontSize={9} fill="#64748b">
            {v}%
          </text>
        );
      })}

      {/* Y axis title */}
      <text
        x={8}
        y={MT + CH / 2}
        textAnchor="middle"
        fontSize={9}
        fill="#94a3b8"
        transform={`rotate(-90, 8, ${MT + CH / 2})`}
      >
        利回り
      </text>
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function SurfaceYieldVacancyPanel({
  propertyPrice,
  monthlyRentFull,
}: SurfaceYieldVacancyPanelProps) {
  const rows = buildRows(propertyPrice, monthlyRentFull);

  const mv5 = maxVacancyFor(5, propertyPrice, monthlyRentFull);
  const mv7 = maxVacancyFor(7, propertyPrice, monthlyRentFull);

  const safetyLevel = getSafetyLevel(mv5);
  const safetyCfg = SAFETY_CONFIG[safetyLevel];

  const fmt = (v: number) =>
    v <= 0 ? '既に目標未達' : v >= 100 ? '— (常に達成)' : `${v.toFixed(1)}%まで`;

  // First row transitions for table annotation
  const firstBelow7 = rows.findIndex((r) => r.surfaceYield < 7);
  const firstBelow5 = rows.findIndex((r) => r.surfaceYield < 5);

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-base font-semibold text-slate-800 mb-1">📊 空室率シミュレーション</h2>
      <p className="text-xs text-slate-500 mb-5">
        月額家賃 <strong>{monthlyRentFull.toFixed(1)}万円</strong> を満室時として、空室率が変わると表面利回りがどう変化するかを試算します
      </p>

      {/* ① Key metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">利回り5%維持の限界</p>
          <p className={`text-base font-bold ${mv5 > 0 ? 'text-amber-700' : 'text-red-600'}`}>
            {fmt(mv5)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">空室率の許容上限</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">利回り7%維持の限界</p>
          <p className={`text-base font-bold ${mv7 > 0 ? 'text-green-700' : 'text-red-600'}`}>
            {fmt(mv7)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">空室率の許容上限</p>
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
          空室率 × 表面利回り（%）
        </p>
        <YieldChart rows={rows} />
        <div className="flex items-center justify-center gap-4 mt-1 mb-2 flex-wrap">
          {YIELD_REFS.map((ref) => (
            <div key={ref.value} className="flex items-center gap-1.5">
              <svg width="18" height="10">
                <line
                  x1="0" y1="5" x2="18" y2="5"
                  stroke={ref.color}
                  strokeWidth="1.5"
                  strokeDasharray={ref.dash}
                />
              </svg>
              <span className="text-xs text-slate-500">{ref.label}ライン</span>
            </div>
          ))}
        </div>
      </div>

      {/* ③ Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="text-left py-2 px-2 text-xs font-semibold text-slate-500 w-16">空室率</th>
              <th className="text-right py-2 px-2 text-xs font-semibold text-slate-500">月間家賃収入</th>
              <th className="text-right py-2 px-2 text-xs font-semibold text-slate-500">年間家賃収入</th>
              <th className="text-right py-2 px-2 text-xs font-semibold text-slate-500">表面利回り</th>
              <th className="text-center py-2 px-2 text-xs font-semibold text-slate-500 w-10">状態</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const st = rowStatus(row.surfaceYield);
              const isFirstBelow7 = i === firstBelow7 && firstBelow7 !== -1;
              const isFirstBelow5 = i === firstBelow5 && firstBelow5 !== -1;

              const borderCls = isFirstBelow5
                ? 'border-t-2 border-t-red-400'
                : isFirstBelow7
                  ? 'border-t-2 border-t-amber-400'
                  : '';

              return (
                <tr
                  key={row.vacancyRate}
                  className={`border-b border-slate-100 ${st.bg} ${borderCls}`}
                >
                  <td className="py-2 px-2 text-slate-700 font-medium">
                    {row.vacancyRate}%
                    {isFirstBelow7 && !isFirstBelow5 && (
                      <span className="ml-1 text-xs bg-amber-100 text-amber-700 px-1 py-0.5 rounded whitespace-nowrap">
                        ←7%割れ
                      </span>
                    )}
                    {isFirstBelow5 && (
                      <span className="ml-1 text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded whitespace-nowrap">
                        ←5%割れ
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-right text-slate-600">
                    {row.monthlyIncome.toFixed(1)}万円
                  </td>
                  <td className="py-2 px-2 text-right text-slate-600">
                    {row.annualIncome.toFixed(1)}万円
                  </td>
                  <td className={`py-2 px-2 text-right font-semibold ${st.color}`}>
                    {row.surfaceYield.toFixed(2)}%
                  </td>
                  <td className="py-2 px-2 text-center text-base">{st.icon}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {[
          { icon: '🌟', label: '10%以上' },
          { icon: '✅', label: '7〜10%' },
          { icon: '⚠️', label: '5〜7%' },
          { icon: '🔵', label: '3〜5%' },
          { icon: '❌', label: '3%未満' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <span className="text-sm">{item.icon}</span>
            <span className="text-xs text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-400 leading-relaxed">
        ※ 表面利回り ＝ 年間家賃収入（空室考慮後）÷ 物件価格 × 100。経費・ローン返済を含まない見た目の利回りです。
        一般的な空室率の目安は10〜20%程度です。
      </p>
    </div>
  );
}
