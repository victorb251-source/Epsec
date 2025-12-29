
import React, { useState } from 'react';
import Header from './components/Header';
import { MicroSimuladoResponse, UserAnswers, Judgement } from './types';
import { generateSimulado } from './services/geminiService';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSimulado, setCurrentSimulado] = useState<MicroSimuladoResponse | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [showGabarito, setShowGabarito] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);
    setShowGabarito(false);
    setUserAnswers({});
    
    try {
      const result = await generateSimulado(input);
      setCurrentSimulado(result);
    } catch (err: any) {
      setError("Falha na engenharia do simulado. Tente uma assertiva mais clara.");
    } finally {
      setLoading(false);
    }
  };

  const handleJudgement = (itemId: number, judgement: Judgement) => {
    if (showGabarito) return;
    setUserAnswers(prev => ({ ...prev, [itemId]: judgement }));
  };

  const revealGabarito = () => {
    if (Object.keys(userAnswers).length < 3) {
      if (!confirm("Você não julgou todos os itens. Deseja ver o gabarito mesmo assim?")) return;
    }
    setShowGabarito(true);
  };

  const calculateScore = () => {
    if (!currentSimulado) return 0;
    return currentSimulado.items.reduce((score, item) => {
      const userAns = userAnswers[item.id];
      if (!userAns) return score;
      return userAns === item.correctJudgement ? score + 1 : score - 1;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-grow max-w-3xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Input Phase */}
        <section className={`bg-white p-6 rounded-2xl shadow-lg border border-slate-200 transition-opacity ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center">
            <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
            Alimentar Sistema (Assertiva Original)
          </h2>
          <form onSubmit={startChallenge}>
            <textarea
              className="w-full h-24 p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-600 outline-none transition-all font-medium text-slate-800 bg-slate-50 resize-none"
              placeholder="Ex: No crime de peculato, a reparação do dano, se precede à sentença irrecorrível, extingue a punibilidade."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-full mt-4 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-xl active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center animate-pulse"><svg className="animate-spin h-4 w-4 mr-2 text-amber-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> GERANDO MICRO-SIMULADO...</span>
              ) : "GERAR DESAFIO 3.0"}
            </button>
          </form>
        </section>

        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded font-bold text-sm animate-bounce">
            {error}
          </div>
        )}

        {/* Phase 1: O Desafio */}
        {currentSimulado && (
          <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">FASE 1: O DESAFIO</h3>
              {showGabarito && (
                <div className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-black">
                  SCORE: {calculateScore()} {calculateScore() === 1 ? 'PONTO' : 'PONTOS'}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {currentSimulado.items.map((item, idx) => {
                const isCorrect = userAnswers[item.id] === item.correctJudgement;
                return (
                  <div key={item.id} className={`bg-white p-6 rounded-2xl border-2 transition-all shadow-sm ${showGabarito ? (isCorrect ? 'border-emerald-500 bg-emerald-50/30' : 'border-rose-500 bg-rose-50/30') : 'border-slate-100 hover:border-amber-200'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">ITEM {idx + 1}</span>
                      <div className="flex gap-2">
                        {(['C', 'E'] as Judgement[]).map((j) => (
                          <button
                            key={j}
                            onClick={() => handleJudgement(item.id, j)}
                            disabled={showGabarito}
                            className={`w-10 h-10 rounded-lg font-black text-sm transition-all border-2 ${
                              userAnswers[item.id] === j 
                                ? (j === 'C' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-rose-600 border-rose-600 text-white')
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                            } ${showGabarito && item.correctJudgement === j ? 'ring-4 ring-amber-400 ring-offset-2 scale-110' : ''}`}
                          >
                            {j}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      {item.text}
                    </p>

                    {/* Phase 2: Dissecção */}
                    {showGabarito && (
                      <div className="mt-6 pt-6 border-t border-slate-200 animate-in fade-in duration-700">
                        <div className="flex items-center mb-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded mr-2 ${item.correctJudgement === 'C' ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'}`}>
                            GABARITO: {item.correctJudgement === 'C' ? 'CERTO' : 'ERRADO'}
                          </span>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Dissecção Técnica</span>
                        </div>
                        <p className="text-slate-600 text-sm italic leading-relaxed">
                          {item.dissection}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!showGabarito ? (
              <button
                onClick={revealGabarito}
                className="w-full py-5 bg-amber-600 hover:bg-amber-700 text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg transition-all"
              >
                FINALIZAR E VER GABARITO (FASE 2)
              </button>
            ) : (
              <div className="bg-slate-900 text-white p-8 rounded-2xl border-t-8 border-amber-600 space-y-4">
                <div>
                  <h4 className="text-amber-500 font-black text-xs uppercase tracking-widest mb-1">FUNDAMENTAÇÃO E FONTE</h4>
                  <p className="text-xl font-serif italic text-slate-100">{currentSimulado.legalBasis}</p>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <h4 className="text-amber-500 font-black text-xs uppercase tracking-widest mb-1">ANÁLISE DO NÚCLEO</h4>
                  <p className="text-slate-400 text-sm">{currentSimulado.originalAnalysis}</p>
                </div>
                <button 
                   onClick={() => { setCurrentSimulado(null); setInput(''); }}
                   className="mt-4 w-full py-3 border border-slate-700 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest"
                >
                  NOVO SIMULADO
                </button>
              </div>
            )}
          </div>
        )}

        {!currentSimulado && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 opacity-60">
             <svg className="w-16 h-16 mx-auto mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
             </svg>
             <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm">Aguardando Protocolo de Início</h3>
             <p className="text-slate-300 text-xs mt-2">Insira uma assertiva para ativar o Modo Expresso 3.0</p>
          </div>
        )}
      </main>

      <footer className="py-10 text-center opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Cebraspe Architect 3.0 Mod Expresso</p>
      </footer>
    </div>
  );
};

export default App;
