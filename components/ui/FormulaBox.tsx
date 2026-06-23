interface FormulaBoxProps {
  title?: string;
  items: {
    label: string;
    formula: string;
    example?: string;
  }[];
}

export default function FormulaBox({ title = '計算式', items }: FormulaBoxProps) {
  return (
    <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-6">
      <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <span className="text-lg">📐</span>
        {title}
      </h3>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i}>
            <p className="text-xs font-medium text-slate-500 mb-1">{item.label}</p>
            <code className="block bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-blue-700 font-mono leading-relaxed">
              {item.formula}
            </code>
            {item.example && (
              <p className="mt-1.5 text-xs text-slate-500 pl-1">
                例：{item.example}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
