interface HeroProps {
  onStart: () => void;
}

const Hero = ({ onStart }: HeroProps) => {

  return (
    <section className="relative z-10 flex flex-col items-center text-center px-6 pt-4 pb-4 min-h-0 animate-fade-in">
      <h1 
        style={{ fontFamily: "'Instrument Serif', serif" }}
        className="text-6xl sm:text-8xl md:text-9xl tracking-tight text-white italic mb-2"
      >
        Chirag Answers
      </h1>
      <h2
        style={{ fontFamily: "'Instrument Serif', serif" }}
        className="text-4xl sm:text-6xl md:text-7xl leading-[1.1] tracking-[-1.5px] font-normal text-white max-w-4xl"
      >
        He knows. He always knows.
      </h2>
      <p className="text-white/60 text-xs sm:text-sm max-w-2xl mt-4 leading-relaxed font-light tracking-wide italic">
        "The ancient one awaits your petition."
      </p>

      <div className="mt-12 flex flex-col items-center gap-6">
        <button
          onClick={onStart}
          className="group relative bg-white hover:bg-white/90 text-black px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 border-none"
        >
          Begin The Ritual
        </button>
      </div>
    </section>
  );
};

export default Hero;
