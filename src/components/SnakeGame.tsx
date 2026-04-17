import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, INITIAL_SPEED } from '../constants';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
  isPaused: boolean;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreUpdate(0);
    setGameOver(false);
    setGameStarted(true);
    setSpeed(INITIAL_SPEED);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused || !gameStarted) return;

    const moveSnake = () => {
      const head = { ...snake[0] };
      const currentDir = nextDirection;
      setDirection(currentDir);

      switch (currentDir) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collision
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return;
      }

      const newSnake = [head, ...snake];

      // Check food
      if (head.x === food.x && head.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreUpdate(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(prev * 0.98, 60)); // Speed up
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [snake, food, nextDirection, gameOver, isPaused, gameStarted, speed, onScoreUpdate, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#18181b'; // cyber-gray
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#d946ef'; // neon-magenta
    ctx.fillStyle = '#d946ef';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.shadowBlur = isHead ? 20 : 10;
      ctx.shadowColor = '#06b6d4'; // neon-cyan
      ctx.fillStyle = isHead ? '#06b6d4' : 'rgba(6, 182, 212, 0.6)';
      
      // Rounded rectangles for smooth snek
      const padding = 2;
      const x = segment.x * cellSize + padding;
      const y = segment.y * cellSize + padding;
      const w = cellSize - padding * 2;
      const h = cellSize - padding * 2;
      const r = isHead ? 6 : 4;

      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();

      // Eye for head
      if (isHead) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        const eyeSize = 2;
        ctx.fillRect(x + w / 4, y + h / 4, eyeSize, eyeSize);
        ctx.fillRect(x + (3 * w) / 4 - eyeSize, y + h / 4, eyeSize, eyeSize);
      }
    });

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="neon-border-cyan p-1 bg-cyber-dark/80 backdrop-blur-sm relative overflow-hidden">
        <div className="scanline"></div>
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="max-w-full aspect-square block rounded-sm shadow-2xl"
        />

        <AnimatePresence>
          {!gameStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-cyber-dark/80 backdrop-blur-md z-20"
            >
              <h2 className="text-4xl font-mono font-bold neon-text-cyan mb-8 tracking-widest uppercase">
                Neon Runner
              </h2>
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-transparent border-2 border-neon-cyan text-neon-cyan font-mono font-bold uppercase tracking-widest hover:bg-neon-cyan hover:text-cyber-dark transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] cursor-pointer"
              >
                Press Start
              </button>
              <p className="mt-8 text-xs text-gray-500 font-mono flex items-center gap-2">
                Use Arrow Keys to Navigate
              </p>
            </motion.div>
          )}

          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-cyber-dark/90 backdrop-blur-lg z-20 border-2 border-neon-magenta/30"
            >
              <h2 className="text-5xl font-mono font-black text-neon-magenta mb-2 tracking-tighter uppercase italic">
                System Failure
              </h2>
              <p className="text-xl font-mono text-cyan-400 mb-8 lowercase">
                Final Score: {score}
              </p>
              <button
                onClick={resetGame}
                className="px-10 py-4 bg-transparent border-2 border-neon-magenta text-neon-magenta font-mono font-bold uppercase tracking-widest hover:bg-neon-magenta hover:text-cyber-dark transition-all duration-300 shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.7)] cursor-pointer"
              >
                Re-Initialize
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
