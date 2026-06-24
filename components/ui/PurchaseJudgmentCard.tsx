import { AdvisorGrade } from './AdvisorCard';

interface PurchaseJudgmentCardProps {
  grade: AdvisorGrade;
  gradeLabel: string;
  reasons: string[];
}

const GRADE_CONFIG: Record<
  AdvisorGrade,
  { bg: string; border: string; gradeColor: string; textColor: string }
> = {
  S: { bg: 'bg-amber-50', border: 'border-amber-300', gradeColor: 'text-amber-600', textColor: 'text-amber-800' },
  A: { bg: 'bg-green-50', border: 'border-green-300', gradeColor: 'text-green-600', textColor: 'text-green-800' },
  B: { bg: 'bg-blue-50', border: 'border-blue-300', gradeColor: 'text-blue-600', textColor: 'text-blue-800' },
  C: { bg: 'bg-amber-50', border: 'border-amber-200', gradeColor: 'text-amber-600', textColor: 'text-amber-800' },
  D: { bg: 'bg-red-50', border: 'border-red-200', gradeColor: 'text-red-600', textColor: 'text-red-800' },
};

export default function PurchaseJudgmentCard({ grade, gradeLabel, reasons }: PurchaseJudgmentCardProps) {
  const cfg = GRADE_CONFIG[grade];

  return (
    <div className={`mt-5 rounded-xl border ${cfg.border} ${cfg.bg} p-4`}>
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold border-2 ${cfg.border} ${cfg.gradeColor} bg-white shrink-0`}
        >
          {grade}
        </div>
        <div>
          <p className="text-xs text-slate-500">購入判定（総合評価）</p>
          <p className={`text-sm font-bold ${cfg.textColor}`}>{gradeLabel}</p>
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-600 mb-2">判定理由</p>
      <ul className="space-y-1.5">
        {reasons.map((reason, i) => (
          <li key={i} className="text-xs text-slate-700 leading-relaxed">
            ・{reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
