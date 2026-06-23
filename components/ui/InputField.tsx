'use client';

import { useState } from 'react';

interface InputFieldProps {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  unit?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export default function InputField({
  label,
  value,
  onChange,
  unit,
  hint,
  min = 0,
  max,
  step = 0.1,
  placeholder,
}: InputFieldProps) {
  const [inputValue, setInputValue] = useState<string>(value !== null ? String(value) : '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={inputValue}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        {unit && (
          <span className="text-slate-500 text-sm whitespace-nowrap shrink-0">{unit}</span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
