
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { Simulado5Response, UserAnswers, Judgement } from './types';
import { generateSimulado5 } from './services/geminiService';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<Simulado5Response | null>(null);
  const [lastRadarTopic, setLastRadarTopic] = useState<string>('');
  const [currentTopicHistory, setCurrentTopicHistory] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [showGabarito, setShowGabarito] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent, overrideInput?: string) => {
    e?.preventDefault();
    const rawInput = overrideInput || input;
    
    if (!rawInput.trim() || loading) return;

    let targetPrompt = rawInput;
    
    const isRadarTrigger = rawInput.trim() === "Gerar questões do Radar";
    
    if (isRadarTrigger) {
      if (lastRadarTopic) {
        targetPrompt = lastRadarTopic;
      } else {
        setError("Radar offline. Realize uma análise inicial para ativar o mapeamento.");
        return;
      }
    }

    setLoading(true);
    setError(null);
    setShowGabarito(false);
    setUserAnswers({});
    
    try {
      const result = await generateSimulado5(targetPrompt, currentTopicHistory);
      setCurrentResult(result);
      setLastRadarTopic(result.peripheralRadar.topic);
      setCurrentTopicHistory(prev => prev ? `${prev} -> ${result.flashcard.theme}` : result.flashcard.theme);
      setInput('');
      if (e) window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError("Falha no Motor 5.3. A calibração de concisão foi interrompida.");
    } finally {
      setLoading(false);
    }
  };

  const handleJudgement = (itemId: number, judgement: Judgement) => {
    if (showGabarito) return;
    setUserAnswers(prev => ({ ...prev, [itemId]: judgement }));
  };

  const revealDiagnosis = () => {
    if (Object.keys(userAnswers).length < 3) {
      if (!confirm("O diagnóstico 5.3 exige a simulação completa para mapear o perfil interpretativo. Deseja prosseguir?")) return;
    }
    setShowGabarito(true);
  };

  const calculateScore = () => {
    if (!currentResult) return 0;
    return currentResult.items.reduce((score, item) => {
      const userAns = userAnswers[item.id];
      if (!userAns) return score;
      return userAns === item.correctJudgement ? score + 1 : score - 1;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col font-sans text-slate-900 selection:bg-amber-200">
      <Header />

      <main className="flex-grow max-w-3xl w-full mx-auto p-4 md:p-8 space-y-12">
        {/* Elite Control Panel */}
        <section className={`bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 transition-all ${loading ? 'opacity-50 blur-[1px] pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
            <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Controle 5.3 (Concisão)</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full h-28 p-6 border border-slate-100 rounded-3xl focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 outline-none transition-all font-medium text-slate-800 bg-slate-50 shadow-inner text-lg leading-relaxed resize-none"
              placeholder="Assertiva ou tema para engenharia reversa..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-full py-5 bg-slate-950 hover:bg-slate-900 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center space-x-3 transition-all shadow-xl active:scale-[0.98] border border-slate-800"
              >
                {loading ? "Processando Bateria..." : "Ativar Motor Elite 5.3"}
              </button>
            </div>
          </form>
        </section>

        {error && (
          <div className="p-6 bg-rose-50 border-l-4 border-rose-600 text-rose-950 rounded-2xl font-bold text-sm shadow-sm flex items-center gap-4 animate-in slide-in-from-top-4">
            <svg className="w-8 h-8 shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-black text-[10px] uppercase tracking-widest opacity-60">Falha Técnica</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Challenge Section */}
        {currentResult && (
          <div className="space-y-10 pb-40 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between px-4 gap-4">
              <div className="flex flex-col max-w-xl">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Mapeamento Contínuo</span>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-serif leading-none">
                  {currentResult.title}
                </h3>
                {currentResult.crossReference && (
                  <p className="text-[11px] text-slate-400 font-bold uppercase mt-3 tracking-tight border-l-2 border-slate-200 pl-3">
                    Conexão: {currentResult.crossReference}
                  </p>
                )}
              </div>
              {showGabarito && (
                <div className="bg-slate-950 text-white px-6 py-3 rounded-full text-xs font-black shadow-2xl ring-4 ring-amber-500/10 border border-slate-800">
                  DESEMPENHO: {calculateScore()} {Math.abs(calculateScore()) === 1 ? 'PONTO' : 'PONTOS'}
                </div>
              )}
            </div>

            {/* Hypothetical Situation Block */}
            {currentResult.hypotheticalSituation && (
              <div className="mx-4 bg-slate-50 border-2 border-slate-200 p-8 rounded-[2rem] shadow-inner">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Situação Hipotética</h4>
                <p className="text-slate-700 font-medium italic leading-relaxed font-serif text-lg">
                  "{currentResult.hypotheticalSituation}"
                </p>
              </div>
            )}

            <div className="grid gap-6">
              {currentResult.items.map((item, idx) => {
                const isCorrect = userAnswers[item.id] === item.correctJudgement;
                return (
                  <div key={item.id} className={`group bg-white p-8 rounded-[2.5rem] border-2 transition-all shadow-lg relative overflow-hidden ${showGabarito ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-500 bg-rose-50/20') : 'border-slate-100 hover:border-slate-300'}`}>
                    {showGabarito && (
                      <div className={`absolute top-0 right-0 px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl ${isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                        {isCorrect ? 'Interpretado' : 'Equivocado'}
                      </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase mb-1">Item #{idx + 1}</span>
                        {showGabarito && (
                          <span className="text-xs font-bold text-amber-600 uppercase tracking-tighter flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            {item.taxonomy}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-3">
                        {(['C', 'E'] as Judgement[]).map((j) => (
                          <button
                            key={j}
                            onClick={() => handleJudgement(item.id, j)}
                            disabled={showGabarito}
                            className={`w-12 h-12 rounded-xl font-black text-sm transition-all border-2 flex items-center justify-center ${
                              userAnswers[item.id] === j 
                                ? (j === 'C' ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg scale-105' : 'bg-rose-600 border-rose-600 text-white shadow-lg scale-105')
                                : 'bg-slate-50 border-slate-100 text-slate-300 hover:bg-white hover:border-slate-400'
                            } ${showGabarito && item.correctJudgement === j ? 'ring-4 ring-amber-400 ring-offset-4 scale-105 z-10' : ''}`}
                          >
                            {j}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-slate-900 font-semibold leading-relaxed text-lg font-serif italic">
                      "{item.text}"
                    </p>

                    {showGabarito && (
                      <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-md tracking-widest uppercase ${item.correctJudgement === 'C' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            Gabarito: {item.correctJudgement === 'C' ? 'Certo' : 'Errado'}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm italic leading-relaxed bg-slate-50/50 p-5 rounded-2xl">
                          {item.dissection}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!showGabarito ? (
              <div className="px-4">
                <button
                  onClick={revealDiagnosis}
                  className="w-full py-6 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-[0.98] text-[11px] border-2 border-amber-600/20"
                >
                  Processar Diagnóstico 5.3
                </button>
              </div>
            ) : (
              <div className="space-y-10 animate-in fade-in duration-1000">
                
                {/* ⚡ Elite Flashcard */}
                <div className="bg-slate-950 text-white p-12 rounded-[3.5rem] border-t-8 border-amber-500 relative overflow-hidden shadow-2xl">
                   <h3 className="text-amber-500 font-black text-xs uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                      <span className="w-12 h-px bg-amber-500"></span>
                      ⚡ Flashcard de Elite
                   </h3>
                   <div className="space-y-8">
                      <div>
                        <span className="text-[10px] font-black text-slate-500 uppercase block mb-1 tracking-[0.2em]">Tema Dominado</span>
                        <p className="text-3xl font-black font-serif italic text-white leading-tight">{currentResult.flashcard.theme}</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                            <span className="text-[10px] font-black text-emerald-500 uppercase block mb-3 tracking-widest">Núcleo Técnico</span>
                            <p className="text-sm text-slate-300 leading-relaxed italic">"{currentResult.flashcard.summary}"</p>
                         </div>
                         <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                            <span className="text-[10px] font-black text-rose-500 uppercase block mb-3 tracking-widest">Veneno da Banca</span>
                            <p className="text-sm text-slate-300 leading-relaxed italic">"{currentResult.flashcard.venom}"</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Radar 5.3 */}
                <div className="bg-white border-2 border-slate-100 p-10 rounded-[3.5rem] shadow-xl">
                   <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                     <div className="bg-amber-100 p-5 rounded-[1.5rem] text-amber-600 shrink-0">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                     </div>
                     <div>
                        <h4 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mb-2 text-center md:text-left">📡 Expansão de Contexto (Radar 5.3)</h4>
                        <p className="text-slate-800 font-bold text-lg leading-relaxed text-center md:text-left">{currentResult.peripheralRadar.context}</p>
                     </div>
                   </div>
                   
                   <div className="space-y-4">
                     <button 
                        onClick={() => handleSubmit(undefined, "Gerar questões do Radar")}
                        className="w-full py-6 bg-slate-900 hover:bg-black text-white rounded-[2.5rem] font-mono text-sm tracking-[0.1em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                     >
                        <span className="text-amber-500">🔘</span>
                        <span>[ Gerar questões do Radar ]</span>
                     </button>
                     <p className="text-slate-400 text-[10px] font-black text-center uppercase tracking-widest italic">
                       Sugestão: {currentResult.peripheralRadar.topic}
                     </p>
                   </div>
                </div>

                <button 
                   onClick={() => { setCurrentResult(null); setInput(''); setCurrentTopicHistory(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                   className="w-full py-6 text-slate-300 hover:text-slate-500 font-black text-[10px] uppercase tracking-[0.6em] transition-all"
                >
                  Reiniciar Trilha de Elite
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!currentResult && !loading && (
          <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 opacity-40 hover:opacity-100 transition-opacity duration-700">
             <div className="relative inline-block mb-10">
                <svg className="w-20 h-20 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
             </div>
             <h3 className="text-slate-950 font-black uppercase tracking-[0.5em] text-sm italic font-serif mb-4">Motor 5.3 Elite Standby</h3>
             <p className="text-slate-400 text-xs font-medium max-w-sm mx-auto italic leading-relaxed">
               "A concisão é a alma da interpretação de elite."
             </p>
          </div>
        )}
      </main>

      <footer className="py-24 text-center border-t border-slate-100 bg-white mt-auto">
        <div className="flex justify-center items-center gap-2 mb-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 6 ? 'bg-amber-500 animate-ping' : 'bg-slate-200'}`}></div>)}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200">Cebraspe Architect Elite Engine</p>
      </footer>
    </div>
  );
};

export default App;
