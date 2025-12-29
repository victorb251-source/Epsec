
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white py-6 shadow-xl border-b-4 border-amber-600">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-amber-600 p-2 rounded shadow-lg">
              <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight uppercase">Cebraspe Architect</h1>
                <span className="bg-amber-600 text-slate-900 text-[10px] px-1.5 py-0.5 rounded font-black">3.0 EXPRESSO</span>
              </div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest opacity-80">Simulador de Imunidade Interpretativa</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
