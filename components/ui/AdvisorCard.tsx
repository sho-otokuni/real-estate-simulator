export type AdvisorGrade = 'S' | 'A' | 'B' | 'C' | 'D';

interface AdvisorCardProps {
  grade: AdvisorGrade;
  gradeLabel: string;
  summary: string;
  positives: string[];
  cautions: string[];
  suggestions: string[];
}

const GRADE_CONFIG: Record<
  AdvisorGrade,
  { bg: string; textColor: string; border: string; gradeColor: string }
> = {
  S: { bg: 'bg-amber-50', textColor: 'text-amber-800', border: 'border-amber-300', gradeColor: 'text-amber-600' },
  A: { bg: 'bg-green-50', textColor: 'text-green-800', border: 'border-green-300', gradeColor: 'text-green-600' },
  B: { bg: 'bg-blue-50', textColor: 'text-blue-800', border: 'border-blue-300', gradeColor: 'text-blue-600' },
  C: { bg: 'bg-amber-50', textColor: 'text-amber-800', border: 'border-amber-200', gradeColor: 'text-amber-600' },
  D: { bg: 'bg-red-50', textColor: 'text-red-800', border: 'border-red-200', gradeColor: 'text-red-600' },
};

export default function AdvisorCard({
  grade,
  gradeLabel,
  summary,
  positives,
  cautions,
  suggestions,
}: AdvisorCardProps) {
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
          <p className="text-xs text-slate-500">AIアドバイザー 総合評価</p>
          <p className={`text-sm font-bold ${cfg.textColor}`}>{gradeLabel}</p>
        </div>
      </div>

      <p className="text-xs text-slate-700 mb-3 leading-relaxed">{summary}</p>

      {positives.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-semibold text-green-700 mb-1">✅ 良い点</p>
          <ul className="space-y-0.5">
            {positives.map((item, i) => (
              <li key={i} className="text-xs text-slate-700">・{item}</li>
            ))}
          </ul>
        </div>
      )}

      {cautions.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-semibold text-amber-700 mb-1">⚠️ 注意点</p>
          <ul className="space-y-0.5">
            {cautions.map((item, i) => (
              <li key={i} className="text-xs text-slate-700">・{item}</li>
            ))}
          </ul>
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-blue-700 mb-1">💡 改善のヒント</p>
          <ul className="space-y-0.5">
            {suggestions.map((item, i) => (
              <li key={i} className="text-xs text-slate-700">・{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
