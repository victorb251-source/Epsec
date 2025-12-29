
import React, { useState } from 'react';

interface RewriteCardProps {
  index: number;
  text: string;
}

const RewriteCard: React.FC<RewriteCardProps> = ({ index, text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border-l-4 border-slate-700 p-5 rounded-r-lg shadow-sm hover:shadow-md transition-shadow relative group">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleCopy}
          className="text-slate-400 hover:text-amber-600 p-1 rounded-md bg-slate-50 border border-slate-200"
          title="Copiar texto"
        >
          {copied ? (
            <span className="text-xs font-semibold text-green-600">Copiado!</span>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          )}
        </button>
      </div>
      <div className="flex items-start">
        <span className="text-slate-400 font-serif font-bold text-lg mr-4">{index}.</span>
        <p className="text-slate-800 leading-relaxed font-medium">
          {text}
        </p>
      </div>
    </div>
  );
};

export default RewriteCard;
