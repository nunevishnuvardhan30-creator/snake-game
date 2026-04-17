import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music as MusicIcon } from 'lucide-react';
import { Track } from '../types';
import { TRACKS } from '../constants';

interface MusicPlayerProps {
  onPlayStateChange: (isPlaying: boolean) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onPlayStateChange }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error('Audio play failed:', e));
      } else {
        audioRef.current.pause();
      }
    }
    onPlayStateChange(isPlaying);
  }, [isPlaying, currentTrackIndex, onPlayStateChange]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full max-w-2xl mx-auto neon-border-magenta bg-cyber-dark/60 backdrop-blur-md p-6 rounded-xl mt-8 relative overflow-hidden group">
      <div className="scanline"></div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-20">
        {/* Album Art */}
        <div className="relative group/art">
          <motion.div
            key={currentTrack.id}
            initial={{ rotate: -5, scale: 0.9, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border-2 border-neon-magenta/50 shadow-[0_0_15px_rgba(217,70,239,0.3)] bg-cyber-gray"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="absolute -bottom-2 -right-2 bg-neon-magenta text-cyber-dark p-2 rounded-full shadow-lg">
            <MusicIcon size={16} />
          </div>

          {/* Visualizer bars */}
          <div className="absolute inset-0 flex items-end justify-center gap-1 p-2 opacity-40 group-hover/art:opacity-100 transition-opacity pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isPlaying ? [4, 20, 8, 24, 6] : 4
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6 + i * 0.1,
                  ease: "easeInOut"
                }}
                className="w-1 bg-neon-magenta rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Info & Controls */}
        <div className="flex-1 w-full text-center md:text-left space-y-4">
          <div>
            <AnimatePresence mode="wait">
              <motion.h3
                key={currentTrack.title}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="text-2xl font-mono font-bold text-neon-magenta tracking-tight"
              >
                {currentTrack.title}
              </motion.h3>
            </AnimatePresence>
            <p className="text-neon-cyan font-mono text-xs uppercase tracking-widest opacity-80">
              {currentTrack.artist}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-cyber-gray rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-neon-magenta to-neon-cyan relative"
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
              </motion.div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase">
              <span>Syncing...</span>
              <span>Audio.sys v2.0</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center md:justify-start gap-8">
            <button onClick={skipBackward} className="text-gray-400 hover:text-neon-cyan transition-colors">
              <SkipBack size={24} />
            </button>
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-neon-magenta bg-neon-magenta/10 text-neon-magenta hover:bg-neon-magenta hover:text-cyber-dark transition-all duration-300 shadow-[0_0_20px_rgba(217,70,239,0.2)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)]"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
            <button onClick={skipForward} className="text-gray-400 hover:text-neon-cyan transition-colors">
              <SkipForward size={24} />
            </button>
          </div>
        </div>

        {/* Right Volume / Status Section */}
        <div className="hidden lg:flex flex-col items-end gap-2 pr-2">
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-3 h-1 rounded-sm ${i < 4 ? 'bg-neon-cyan' : 'bg-cyber-gray'}`}></div>
                ))}
            </div>
            <Volume2 size={16} className="text-gray-600" />
            <span className="text-[10px] font-mono text-gray-700 writing-vertical rotate-180 uppercase tracking-tighter self-end mt-4">
                Transmission Stable
            </span>
        </div>
      </div>
    </div>
  );
};
