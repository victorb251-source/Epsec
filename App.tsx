
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import RewriteCard from './components/RewriteCard';
import { HistoryItem, AssertionRewriteResponse } from './types';
import { generateRewrites } from './services/geminiService';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentResult, setCurrentResult] = useState<AssertionRewriteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cebraspe_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('cebraspe_history', JSON.stringify(history));
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);
    
    try {
      const result = await generateRewrites(input);
      setCurrentResult(result);
      
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        original: input,
        rewrites: result,
        timestamp: Date.now()
      };
      
      setHistory(prev => [newItem, ...prev].slice(0, 10)); // Keep last 10
    } catch (err: any) {
      console.error(err);
      setError("Ocorreu um erro ao processar sua solicitação. Verifique sua conexão ou tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrentResult(null);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Input Section */}
        <section className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <label className="block text-slate-700 font-bold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Assertiva para Refinamento
          </label>
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all font-medium text-slate-800 resize-none bg-slate-50"
              placeholder="Ex: 'É vedada a acumulação remunerada de cargos públicos, exceto, quando houver compatibilidade de horários, a de dois cargos de professor.'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={`flex-1 py-3 px-6 rounded-lg font-bold text-white transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
                  loading || !input.trim() 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-amber-600 hover:bg-amber-700 shadow-lg hover:shadow-amber-200'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Refinando Assertiva...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>Mimetizar Estilo Cebraspe</span>
                  </>
                )}
              </button>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  className="py-3 px-6 rounded-lg font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200"
                >
                  Limpar Tudo
                </button>
              )}
            </div>
          </form>
        </section>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded-md">
            <p className="font-bold">Atenção</p>
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {currentResult && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Variações Estratégicas</h2>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold uppercase tracking-wider">Altamente Sofisticado</span>
            </div>
            
            <div className="space-y-4">
              {currentResult.variations.map((v, i) => (
                <RewriteCard key={i} index={i + 1} text={v} />
              ))}
            </div>

            <div className="bg-slate-800 text-slate-200 p-6 rounded-xl border border-slate-700 shadow-inner">
              <h3 className="text-amber-400 font-bold mb-3 flex items-center uppercase tracking-widest text-sm">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Nota do Examinador
              </h3>
              <p className="text-slate-300 leading-relaxed italic">
                {currentResult.examinerNote}
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!currentResult && !loading && !error && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="text-slate-300 mb-4 flex justify-center">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-slate-500 font-medium text-lg">Pronto para a reconstrução textual.</h3>
            <p className="text-slate-400">Insira uma assertiva acima para começar o treinamento de flexibilidade cognitiva.</p>
          </div>
        )}
      </main>

      <footer className="bg-slate-100 py-8 border-t border-slate-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Cebraspe Architect. Uso estritamente educacional.</p>
          <p className="mt-2 font-light">"A interpretação precede o conhecimento."</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
