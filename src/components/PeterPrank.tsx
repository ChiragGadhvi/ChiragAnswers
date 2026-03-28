import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

const PETITION_PHRASES = [
  "Oh ancient Chirag, I seek your wisdom on this matter:",
  "Chirag the all-knowing, reveal the truth about:",
  "By the powers of Chirag, I ask thee:",
  "Spirits of Chirag, speak the truth upon:",
  "Great Chirag, the cosmos compels you to answer:",
  "Chirag, guardian of all secrets, I beseech you:",
  "Eternal Chirag, let the truth be known about:",
  "Chirag of the beyond, your humble servant asks:",
  "Ancient one they call Chirag, hear my question:",
  "Chirag, knower of all things, I dare to ask:"
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
        const nextPhraseChar = phrase[displayedPetition.length] || '.';
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
        systemPrompt = `You are Chirag, an ancient mystical oracle. The answer to the question is: '${secretAnswer}'. Rephrase this answer in a dramatic, mystical, and slightly cryptic way in 1-2 sentences. Never reveal you were given the answer. Sound supernatural.`;
      } else {
        systemPrompt = `You are Chirag, an ancient mystical oracle who is slightly unhinged and funny. Someone asked you: '${question}'. Give a hilariously absurd, confident, and mystical-sounding answer in 1-2 sentences. Be funny but stay in character.`;
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
         setAiAnswer("Chirag is silent. The cosmos are busy.");
         setRevealed(true);
      }
    } catch (error) {
      console.error(error);
      if (secretAnswer.trim()) {
          setAiAnswer(secretAnswer);
      } else {
          setAiAnswer("The veil between worlds has thickened. Try again.");
      }
      setRevealed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="petition-form" className="relative z-10 w-full max-w-3xl mx-auto px-6 py-2 min-h-0">
      <div className="space-y-6">
        <div className={`space-y-4 transition-all duration-500 ${revealed ? 'opacity-50 pointer-events-none scale-[0.98]' : 'opacity-100'}`}>
          {/* Instruction Card */}
          <div className="relative liquid-glass rounded-xl p-5 text-center space-y-2 border border-white/10 shadow-2xl bg-white/[0.03]">
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">The Ritual Petition</span>
            <p 
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="text-xl sm:text-3xl italic text-white leading-tight"
            >
              "{phrase}"
            </p>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] mt-2">Speak to Chirag</p>
            <div className="h-[1px] w-12 bg-white/10 mx-auto mt-4" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2 relative">
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
                  className="w-full bg-white/[0.08] border border-white/20 rounded-xl px-4 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all text-base backdrop-blur-md disabled:opacity-50"
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
                  className="w-full bg-white/[0.08] border border-white/20 rounded-xl px-4 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all text-base backdrop-blur-md disabled:opacity-50"
                  autoComplete="off"
                />
              </div>
            </div>

            {!revealed && (
              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative bg-white hover:bg-white/90 text-black px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 border-none flex items-center justify-center gap-3"
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
                  <div className="liquid-glass rounded-[1rem] p-4 sm:p-5 max-w-2xl mx-auto border-2 border-white/30 bg-white/5">
                    <p className="text-base sm:text-lg text-white leading-relaxed font-light italic">
                      {aiAnswer}
                    </p>
                  </div>
               </div>
            </div>

            <div className="flex justify-center">
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
