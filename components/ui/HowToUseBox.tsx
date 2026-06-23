'use client';

import { useState } from 'react';

interface HowToUseBoxProps {
  whatYouLearn: React.ReactNode;
  whenToUse: React.ReactNode;
  inputGuide: React.ReactNode;
  resultGuide: React.ReactNode;
}

export default function HowToUseBox({
  whatYouLearn,
  whenToUse,
  inputGuide,
  resultGuide,
}: HowToUseBoxProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl mb-8">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-slate-700">📖 このツールの使い方</span>
        <span
          className={`text-slate-400 text-base leading-none transition-transform duration-200 inline-block ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="border-t border-slate-200 px-5 pb-5">
          <div className="grid sm:grid-cols-2 gap-x-6">
            <div className="mt-4">
              <p className="text-xs font-semibold text-blue-700 mb-1.5">📊 このツールでわかること</p>
              <div className="text-sm text-slate-600 leading-relaxed">{whatYouLearn}</div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-green-700 mb-1.5">🕐 こんな時に使います</p>
              <div className="text-sm text-slate-600 leading-relaxed">{whenToUse}</div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-purple-700 mb-1.5">✏️ 入力項目の意味</p>
              <div className="text-sm text-slate-600 leading-relaxed">{inputGuide}</div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-amber-700 mb-1.5">📈 結果の見方</p>
              <div className="text-sm text-slate-600 leading-relaxed">{resultGuide}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
