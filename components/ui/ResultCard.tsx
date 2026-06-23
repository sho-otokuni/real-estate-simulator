interface ResultCardProps {
  label: string;
  value: string;
  unit?: string;
  description?: string;
  highlight?: boolean;
  positive?: boolean;
  negative?: boolean;
  size?: 'normal' | 'large';
}

export default function ResultCard({
  label,
  value,
  unit,
  description,
  highlight = false,
  positive = false,
  negative = false,
  size = 'normal',
}: ResultCardProps) {
  const valueColor = positive
    ? 'text-green-600'
    : negative
      ? 'text-red-600'
      : highlight
        ? 'text-blue-600'
        : 'text-slate-800';

  return (
    <div className={`py-3 border-b border-slate-100 last:border-0 ${highlight ? 'bg-blue-50 -mx-6 px-6 rounded-lg my-1' : ''}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm text-slate-600 shrink-0">{label}</span>
        <div className="flex items-baseline gap-1 text-right">
          <span className={`font-bold ${size === 'large' ? 'text-3xl' : 'text-xl'} ${valueColor}`}>
            {value}
          </span>
          {unit && <span className="text-sm text-slate-500">{unit}</span>}
        </div>
      </div>
      {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
    </div>
  );
}
