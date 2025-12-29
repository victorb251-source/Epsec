
import React, { useState } from 'react';

interface RewriteCardProps {
  level: number;
  label: string;
  text: string;
}

const RewriteCard: React.FC<RewriteCardProps> = ({ level, label, text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const levelColors: Record<number, string> = {
    1: 'border-emerald-500',
    2: 'border-blue-500',
    3: 'border-amber-500',
    4: 'border-orange-500',
    5: 'border-rose-600 bg-rose-50/30'
  };

  const levelBg: Record<number, string> = {
    1: 'bg-emerald-100 text-emerald-800',
    2: 'bg-blue-100 text-blue-800',
    3: 'bg-amber-100 text-amber-800',
    4: 'bg-orange-100 text-orange-800',
    5: 'bg-rose-100 text-rose-800'
  };

  return (
    <div className={`bg-white border-l-4 ${levelColors[level] || 'border-slate-700'} p-5 rounded-r-lg shadow-sm hover:shadow-md transition-all relative group`}>
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleCopy}
          className="text-slate-400 hover:text-amber-600 p-1.5 rounded-md bg-white border border-slate-200 shadow-sm"
          title="Copiar texto"
        >
          {copied ? (
            <span className="text-[10px] font-bold text-green-600 px-1">COPIADO</span>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          )}
        </button>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-3 mb-1">
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${levelBg[level]}`}>
            {label}
          </span>
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= level ? (level === 5 ? 'bg-rose-600' : 'bg-slate-400') : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
        <p className={`text-slate-800 leading-relaxed ${level === 5 ? 'font-semibold' : 'font-medium'}`}>
          {text}
        </p>
      </div>
    </div>
  );
};

export default RewriteCard;
