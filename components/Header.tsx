
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-950 text-white py-6 shadow-2xl border-b-4 border-amber-600 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-amber-600 p-2.5 rounded shadow-[0_0_20px_rgba(245,158,11,0.6)]">
              <svg className="w-6 h-6 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tighter uppercase font-serif italic">Cebraspe Architect</h1>
                <span className="bg-amber-600 text-slate-950 text-[9px] px-2 py-0.5 rounded-sm font-black animate-pulse">5.3 ELITE</span>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] opacity-80 mt-0.5">Protocolo de Concisão & Inferência</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
