interface NavbarProps {
  onHome: () => void;
}

const Navbar = ({ onHome }: NavbarProps) => {
  return (
    <nav className="relative z-50 w-full px-8 pt-10 pb-4">
      <div className="max-w-7xl mx-auto flex flex-row justify-start items-center">
        <button 
          onClick={onHome}
          className="flex items-center gap-4 hover:opacity-70 transition-all border-none bg-transparent group"
        >
          <img 
            src="/chirag.svg" 
            alt="Chirag Icon" 
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform"
          />
          <span 
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-2xl sm:text-4xl tracking-tight text-white italic"
          >
            Chirag Answers
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
