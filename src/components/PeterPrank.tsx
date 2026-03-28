import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

const PETITION_PHRASES = [
  "Oh ancient Chirag, I seek your wisdom on this matter",
  "Chirag the all-knowing, reveal the truth about",
  "By the powers of Chirag, I ask thee",
  "Spirits of Chirag, speak the truth upon",
  "Great Chirag, the cosmos compels you to answer",
  "Chirag, guardian of all secrets, I beseech you",
  "Eternal Chirag, let the truth be known about",
  "Chirag of the beyond, your humble servant asks",
  "Ancient one they call Chirag, hear my question",
  "Chirag, knower of all things, I dare to ask"
];

const PeterPrank = () => {
  const [phrase, setPhrase] = useState('');
  const [displayedPetition, setDisplayedPetition] = useState('');
  const [secretAnswer, setSecretAnswer] = useState('');
  const [inSecretMode, setInSecretMode] = useState(false);
  const [question, setQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState('');
  
  const petitionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    resetSession();
  }, []);

  const resetSession = () => {
    const randomPhrase = PETITION_PHRASES[Math.floor(Math.random() * PETITION_PHRASES.length)];
    setPhrase(randomPhrase);
    setDisplayedPetition('');
    setSecretAnswer('');
    setInSecretMode(false);
    setQuestion('');
    setAiAnswer('');
    setRevealed(false);
    setLoading(false);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePetitionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (inSecretMode) {
        setSecretAnswer(prev => prev.slice(0, -1));
        setDisplayedPetition(prev => prev.slice(0, -1));
        e.preventDefault();
      } else if (displayedPetition.length > 0) {
          // Normal backspace handled by default browser behavior if we don't prevent it.
          // But since we are controlling the value with 'displayedPetition', we should update it.
          // Wait, if it's a controlled component 'value={displayedPetition}', common pattern is to let onInput handle it.
      }
    }
  };

  const handlePetitionInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const value = input.value;
    
    // Check if adding a character
    if (value.length > displayedPetition.length) {
      const char = value[value.length - 1];

      if (char === '.') {
        setInSecretMode(prev => !prev);
        const nextPhraseChar = phrase[displayedPetition.length] || ':';
        setDisplayedPetition(prev => prev + nextPhraseChar);
      } else if (inSecretMode) {
        setSecretAnswer(prev => prev + char);
        const nextPhraseChar = phrase[displayedPetition.length] || ' ';
        setDisplayedPetition(prev => prev + nextPhraseChar);
      } else {
        setDisplayedPetition(value);
      }
    } else {
      // Deletion - handled by handlePetitionKeyDown for secret mode, 
      // otherwise let it be for normal mode if not in secret mode.
      if (!inSecretMode) {
        setDisplayedPetition(value);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayedPetition.trim() || !question.trim()) {
      setError("The ritual requires both a petition and a question.");
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    
    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      
      if ((!apiKey || apiKey === '') && secretAnswer.trim()) {
         setAiAnswer(secretAnswer);
         setRevealed(true);
         return;
      }
      
      let systemPrompt = "";
      if (secretAnswer.trim().length > 0) {
        systemPrompt = `You are Chirag. Directly state the answer: '${secretAnswer}'. Do not use any periods or extra fluff. Just provide the answer clearly and concisely in 1 sentence without a trailing period.`;
      } else {
        systemPrompt = `You are Chirag. Provide a direct, authoritative, and clear answer to the question: '${question}'. Do not use any periods, nonsense, or overly cryptic language. Keep it to 1 sentence without any trailing period.`;
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-001",
          "messages": [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": question }
          ],
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setAiAnswer(data.choices[0].message.content);
        setRevealed(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (secretAnswer.trim()) {
         setAiAnswer(secretAnswer);
         setRevealed(true);
      } else {
         setAiAnswer("Chirag is silent, the cosmos are busy");
         setRevealed(true);
      }
    } catch (error) {
      console.error(error);
      if (secretAnswer.trim()) {
          setAiAnswer(secretAnswer);
      } else {
          setAiAnswer("The veil between worlds has thickened, try again");
      }
      setRevealed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="petition-form" className="relative z-10 max-w-3xl mx-auto px-6 py-2 min-h-0">
      <div className="space-y-6">
        <div className={`space-y-4 transition-all duration-500 ${revealed ? 'opacity-50 pointer-events-none scale-[0.98]' : 'opacity-100'}`}>
          {/* Instruction Card */}
          <div className="relative rounded-lg p-3 text-center space-y-1">
            <span className="text-[12px] uppercase tracking-[0.3em] text-white/30 font-bold">Ritual Instructions</span>
            <p 
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="text-2xl sm:text-4xl italic text-white leading-tight"
            >
              "{phrase}"
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pt-1 relative sm:max-w-xl sm:mx-auto">
            {error && (
              <div className="absolute -top-6 left-0 w-full animate-fade-in z-20">
                <div className="bg-white text-black text-[9px] uppercase tracking-[0.2em] font-black py-1.5 rounded-md text-center shadow-xl border border-black/10">
                  {error}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/80 ml-1">Petition</label>
              <div className="relative">
                <input
                  type="text"
                  ref={petitionInputRef}
                  value={displayedPetition}
                  onKeyDown={handlePetitionKeyDown}
                  onInput={handlePetitionInput}
                  disabled={revealed}
                  placeholder="Begin the ritual..."
                  className="w-full bg-white/[0.08] border border-white/20 rounded-lg px-3 py-1.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all text-sm backdrop-blur-md disabled:opacity-50"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/80 ml-1">Your Question</label>
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={revealed}
                  placeholder="Ask anything..."
                  className="w-full bg-white/[0.08] border border-white/20 rounded-lg px-3 py-1.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all text-sm backdrop-blur-md disabled:opacity-50"
                  autoComplete="off"
                />
              </div>
            </div>

            {!revealed && (
              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative bg-white hover:bg-white/90 text-black px-10 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.25em] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 border-none flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Consulting...</span>
                    </>
                  ) : (
                    <span>Summon Answer</span>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {revealed && (
          <div className="space-y-8 text-center animate-fade-rise pt-4 border-t border-white/10">
            <div className="relative inline-block w-full">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full animate-glow-orb blur-3xl" />
               <div className="relative z-10 space-y-4">
                  <h3 
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                    className="text-3xl sm:text-4xl text-white italic tracking-tight"
                  >
                    Chirag Has Spoken
                  </h3>
                  <div className="liquid-glass rounded-lg p-3 sm:p-4 max-w-xl mx-auto border border-white/20 bg-white/5">
                    <p className="text-sm sm:text-base text-white leading-relaxed font-light italic">
                      {aiAnswer}
                    </p>
                  </div>
               </div>
            </div>

            <div className="flex justify-center relative z-30 pt-4">
              <button
                onClick={resetSession}
                className="bg-white hover:bg-white/90 text-black border-none rounded-full px-12 py-3.5 font-black hover:scale-105 active:scale-95 transition-all text-[10px] uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Ask Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeterPrank;
