
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white py-8 shadow-lg border-b-4 border-amber-500">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center space-x-4">
          <div className="bg-amber-500 p-2 rounded-lg">
            <svg className="w-8 h-8 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L1 21h22L12 2zm0 3.45l8.27 14.3H3.73L12 5.45zM11 15v2h2v-2h-2zm0-6v4h2V9h-2z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cebraspe Architect</h1>
            <p className="text-slate-400 font-light italic">Refinando a cognição para o alto desempenho.</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
