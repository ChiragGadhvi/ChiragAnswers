import { useState } from 'react';
import BackgroundVideo from './components/BackgroundVideo';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PeterPrank from './components/PeterPrank';

function App() {
  const [isStarted, setIsStarted] = useState(false);

  const goToHome = () => setIsStarted(false);

  return (
    <div className="relative h-screen overflow-hidden selection:bg-white/20 selection:text-white">
      {/* Background Layer */}
      <BackgroundVideo />

      {/* Content Layer */}
      <main className="relative z-10 w-full h-full flex flex-col items-center">
        <Navbar onHome={goToHome} />
        
        <div className="flex-grow flex flex-col items-center justify-start pt-[6vh] sm:pt-[4vh] w-full max-w-7xl mx-auto px-6">
          {!isStarted ? (
            <Hero onStart={() => setIsStarted(true)} />
          ) : (
            <div className="w-full flex flex-col items-center animate-fade-in">
              <PeterPrank />
            </div>
          )}
        </div>
      </main>

      {/* Cinematic Blur Edges */}
      <div className="fixed inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-20" />
      <div className="fixed inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-20" />
    </div>
  );
}

export default App;
