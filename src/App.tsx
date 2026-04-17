import { useState } from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Activity, Cpu, Terminal, Zap } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) setHighScore(newScore);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-cyber-dark overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)] opacity-50"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-neon-magenta/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px]"></div>
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-20"
             style={{
               backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
               backgroundSize: '100px 100px',
               perspective: '1000px',
               transform: 'rotateX(60deg) scale(2)',
               transformOrigin: 'top'
             }}>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col gap-8 items-center">
        {/* Header Section */}
        <header className="w-full flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 neon-border-cyan flex items-center justify-center rounded-lg bg-cyber-gray overflow-hidden relative">
              <Zap className="text-neon-cyan animate-pulse" size={24} />
              <div className="scanline"></div>
            </div>
            <div>
              <h1 className="text-3xl font-mono font-black tracking-tighter uppercase italic leading-none text-white">
                Pulse<span className="text-neon-cyan">Runner</span>
              </h1>
              <p className="text-[10px] font-mono text-neon-magenta tracking-[0.3em] uppercase opacity-80">
                Neural Interface v4.02.a
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Score</span>
              <span className="text-3xl font-mono font-bold neon-text-cyan tabular-nums">{score}</span>
            </div>
            <div className="w-px h-10 bg-gray-800"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">High Score</span>
              <span className="text-3xl font-mono font-bold text-neon-magenta tabular-nums">{highScore}</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
          
          {/* Left Stats/Info Panel */}
          <section className="hidden lg:flex flex-col gap-4 mt-12">
            <div className="neon-border-cyan/30 p-4 bg-cyber-gray/40 backdrop-blur-sm rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neon-cyan">CPU LOAD</span>
                <div className="flex gap-0.5">
                  {[...Array(12)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      animate={{ height: [6, Math.random() * 12 + 6, 6] }} 
                      transition={{ repeat: Infinity, duration: Math.random() + 0.5 }}
                      className="w-1 bg-neon-cyan opacity-60"
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Terminal size={14} className="text-neon-cyan" />
                <span className="text-[10px] font-mono text-gray-400">CONNECTING... ENCRYPTION: AES-256</span>
              </div>
              <div className="flex items-center gap-3">
                <Activity size={14} className="text-neon-cyan" />
                <span className="text-[10px] font-mono text-gray-400">LATENCY: 12ms | STABLE</span>
              </div>
            </div>

            <div className="neon-border-magenta/20 p-4 bg-cyber-gray/40 backdrop-blur-sm rounded-lg">
              <h4 className="text-[10px] font-mono text-neon-magenta mb-3 uppercase tracking-widest font-bold">Protocol Info</h4>
              <p className="text-xs font-mono text-gray-500 leading-relaxed">
                Consume biometric nodes to increase neural synchronicity. Avoid collision with containment field or self-feedback loops.
              </p>
            </div>
          </section>

          {/* Game Window */}
          <section>
            <SnakeGame onScoreUpdate={handleScoreUpdate} isPaused={false} />
          </section>

          {/* Right System Panel */}
          <section className="hidden lg:flex flex-col gap-4 mt-12 content-end">
            <div className="neon-border-magenta/30 p-4 bg-cyber-gray/40 backdrop-blur-sm rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neon-magenta">WAVEFORM</span>
                <Cpu size={14} className="text-neon-magenta" />
              </div>
              <div className="h-16 flex items-end gap-1 overflow-hidden">
                {[...Array(24)].map((_, i) => (
                   <motion.div
                    key={i}
                    animate={{
                      height: isMusicPlaying ? [2, Math.random() * 40 + 10, 2] : 2,
                      opacity: isMusicPlaying ? [0.4, 0.8, 0.4] : 0.2
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.4 + Math.random() * 0.4
                    }}
                    className="flex-1 bg-neon-magenta"
                   />
                ))}
              </div>
              <div className="text-[9px] font-mono text-gray-600 text-right uppercase">
                Sub-Oscillator Active
              </div>
            </div>
          </section>

        </main>

        {/* Footer / Music Player */}
        <footer className="w-full flex flex-col items-center">
          <MusicPlayer onPlayStateChange={setIsMusicPlaying} />
          <div className="mt-8 flex items-center gap-12 text-[10px] font-mono text-gray-700 uppercase tracking-[0.5em]">
            <span>© 2077 CyberSystems Inc.</span>
            <span>Authored by Vishnuvardhan</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
