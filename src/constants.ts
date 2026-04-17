import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'SynthWave AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400',
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'BitGlitch',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber2/400/400',
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'RetroRunner',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/midnight3/400/400',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = 'UP';
export const INITIAL_SPEED = 150;
