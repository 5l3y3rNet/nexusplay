export interface Game {
  id: string;
  slug: string;
  title: string;
  filename: string;
  category: string;
  description: string;
  longDescription: string;
  rtp: string;
  volatility: 'Low' | 'Medium' | 'High' | 'Very High';
  releaseDate: string;
  devices: string[];
  currencies: string[];
  languages: string[];
  minBet: string;
  maxBet: string;
  maxWin: string;
  tags: string[];
  status: 'active' | 'new' | 'featured';
  thumbnail: string;
  accentColor: string;
}

export const games: Game[] = [
  {
    id: 'elevator',
    slug: 'elevator',
    title: 'ELEVATOR',
    filename: 'Elevator.html',
    category: 'Crash',
    description: 'Ride the elevator up and cash out before it crashes. Every floor multiplies your bet.',
    longDescription: 'ELEVATOR is a high-octane crash game where players ride an ascending elevator, watching their multiplier grow with every floor. The tension builds as you decide when to cash out — wait too long and the elevator crashes, losing your bet. With a provably fair RNG engine, lightning-fast rounds, and an intuitive auto-cashout feature, ELEVATOR delivers the pure rush of crash gaming in a sleek vertical format.',
    rtp: '97.00%',
    volatility: 'Very High',
    releaseDate: '2024-09-15',
    devices: ['Desktop', 'Mobile', 'Tablet'],
    currencies: ['USD', 'EUR', 'GBP', 'BTC', 'ETH'],
    languages: ['English', 'Spanish', 'Portuguese', 'Russian'],
    minBet: '$0.10',
    maxBet: '$500',
    maxWin: '10,000x',
    tags: ['crash', 'multiplier', 'instant'],
    status: 'featured',
    thumbnail: '/thumbs/elevator.svg',
    accentColor: '#6366f1',
  },
  {
    id: 'hook',
    slug: 'deep-hook',
    title: 'DEEP HOOK',
    filename: 'Hook.html',
    category: 'Arcade',
    description: 'Drop the hook into the deep ocean and reel in massive multipliers from the depths.',
    longDescription: 'DEEP HOOK takes players beneath the waves in a deep-sea fishing adventure where every cast can bring up a monster multiplier. The hook descends through layers of the ocean — shallow reef, mid-water, and the abyss — each zone offering higher risk and higher rewards. A unique zone-based multiplier system makes every round a strategic decision.',
    rtp: '96.50%',
    volatility: 'High',
    releaseDate: '2024-10-01',
    devices: ['Desktop', 'Mobile', 'Tablet'],
    currencies: ['USD', 'EUR', 'GBP', 'CAD'],
    languages: ['English', 'French', 'German', 'Spanish'],
    minBet: '$0.20',
    maxBet: '$200',
    maxWin: '5,000x',
    tags: ['arcade', 'fishing', 'multiplier'],
    status: 'active',
    thumbnail: '/thumbs/hook.svg',
    accentColor: '#0ea5e9',
  },
  {
    id: 'xenocraft',
    slug: 'xenocraft',
    title: 'XENOCRAFT',
    filename: 'alien-enchant.html',
    category: 'Crash',
    description: 'Board the alien spacecraft and fly through the cosmos. Cash out before the engines overheat.',
    longDescription: 'XENOCRAFT is a sci-fi crash experience set aboard an alien spacecraft launching through deep space. The spacecraft\'s energy core powers up as the multiplier climbs — but push the engines too hard and the core overloads. With its alien visual language, atmospheric soundtrack, and seamless mobile gameplay, XENOCRAFT is a crash game built for a new generation of players.',
    rtp: '97.00%',
    volatility: 'Very High',
    releaseDate: '2024-11-12',
    devices: ['Desktop', 'Mobile', 'Tablet'],
    currencies: ['USD', 'EUR', 'USDT', 'BTC'],
    languages: ['English', 'Japanese', 'Korean', 'Chinese'],
    minBet: '$0.10',
    maxBet: '$1,000',
    maxWin: '50,000x',
    tags: ['crash', 'sci-fi', 'space', 'multiplier'],
    status: 'new',
    thumbnail: '/thumbs/xenocraft.svg',
    accentColor: '#a855f7',
  },
  {
    id: 'bunny-job',
    slug: 'bunny-job',
    title: 'Bunny Job',
    filename: 'bell-jump.html',
    category: 'Arcade',
    description: 'Help the bunny leap to safety across floating platforms. Light-hearted fun with serious rewards.',
    longDescription: 'Bunny Job is a charming arcade platformer where a courageous bunny jumps across a series of safe platforms and hidden traps. Choose your path — play it safe on solid ground or leap into the unknown for bigger multipliers. With adorable pixel-art aesthetics and a progressive difficulty system, Bunny Job is the perfect blend of casual appeal and genuine gambling tension.',
    rtp: '95.00%',
    volatility: 'Medium',
    releaseDate: '2024-08-20',
    devices: ['Desktop', 'Mobile', 'Tablet'],
    currencies: ['USD', 'EUR', 'GBP'],
    languages: ['English', 'Spanish', 'Turkish'],
    minBet: '$0.10',
    maxBet: '$100',
    maxWin: '1,000x',
    tags: ['arcade', 'platformer', 'casual'],
    status: 'active',
    thumbnail: '/thumbs/bunny-job.svg',
    accentColor: '#f59e0b',
  },
  {
    id: 'bomb-defusal',
    slug: 'bomb-defusal',
    title: 'Bomb Defusal',
    filename: 'bomb-defusal.html',
    category: 'Minesweeper',
    description: 'Defuse the grid — avoid hidden bombs and rack up a multiplier with every safe tile revealed.',
    longDescription: 'Bomb Defusal is a tactical minesweeper-style game where tension and strategy collide. Players reveal tiles on a grid, each safe tile increasing the multiplier — but hidden bombs end the round instantly. With configurable bomb counts, auto-reveal options, and a clean interface inspired by military tactical systems, Bomb Defusal rewards careful players with outsized rewards.',
    rtp: '97.00%',
    volatility: 'High',
    releaseDate: '2024-07-10',
    devices: ['Desktop', 'Mobile', 'Tablet'],
    currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    languages: ['English', 'German', 'French', 'Russian'],
    minBet: '$0.10',
    maxBet: '$500',
    maxWin: '24,000x',
    tags: ['minesweeper', 'strategy', 'grid'],
    status: 'featured',
    thumbnail: '/thumbs/bomb-defusal.svg',
    accentColor: '#ef4444',
  },
  {
    id: 'chip-drop',
    slug: 'chip-drop',
    title: 'CHIP DROP',
    filename: 'chip_drop_v3.html',
    category: 'Plinko',
    description: 'Drop the chip from the top and watch it cascade through pegs into high-value multiplier slots.',
    longDescription: 'CHIP DROP is a premium Plinko experience with casino-grade physics and a full spectrum of risk settings. Drop chips from the apex and watch them ricochet through a field of pegs, landing in multiplier slots ranging from 0.2x to 1,000x. With three board sizes, adjustable risk levels, and real-time ball physics, CHIP DROP is endlessly replayable and strategically deep.',
    rtp: '97.00%',
    volatility: 'Medium',
    releaseDate: '2024-06-01',
    devices: ['Desktop', 'Mobile', 'Tablet'],
    currencies: ['USD', 'EUR', 'GBP', 'BTC', 'ETH', 'USDT'],
    languages: ['English', 'Spanish', 'Portuguese', 'Italian', 'French'],
    minBet: '$0.10',
    maxBet: '$200',
    maxWin: '1,000x',
    tags: ['plinko', 'physics', 'casual'],
    status: 'featured',
    thumbnail: '/thumbs/chip-drop.svg',
    accentColor: '#10b981',
  },
  {
    id: 'daredevil-drop',
    slug: 'daredevil-drop',
    title: 'DAREDEVIL DROP',
    filename: 'daredevil_drop.html',
    category: 'Crash',
    description: 'Freefall from the skyscraper edge and pull the parachute at exactly the right moment.',
    longDescription: 'DAREDEVIL DROP puts you in the shoes of an extreme sports daredevil launching off a skyscraper in freefall. Your multiplier climbs as you plummet — pull the parachute too early and you leave value on the table, too late and you hit the ground. With cinematic visuals, dramatic audio design, and tight crash mechanics, DAREDEVIL DROP is one of the most visceral crash titles available.',
    rtp: '97.00%',
    volatility: 'Very High',
    releaseDate: '2024-12-01',
    devices: ['Desktop', 'Mobile', 'Tablet'],
    currencies: ['USD', 'EUR', 'GBP', 'CAD'],
    languages: ['English', 'Spanish', 'Polish', 'Romanian'],
    minBet: '$0.25',
    maxBet: '$1,000',
    maxWin: '100,000x',
    tags: ['crash', 'extreme', 'premium'],
    status: 'new',
    thumbnail: '/thumbs/daredevil-drop.svg',
    accentColor: '#f97316',
  },
  {
    id: 'glass-rush',
    slug: 'glass-rush',
    title: 'Glass Rush',
    filename: 'game_squid.html',
    category: 'Arcade',
    description: 'Cross the glass bridge — each panel is either solid or deadly. Make it across for the jackpot.',
    longDescription: 'Glass Rush is inspired by the iconic glass bridge challenge — players must cross a series of panels, choosing left or right at each step. One panel is solid, the other will shatter. The further you progress, the higher your multiplier climbs. With multiplayer observation mode, provably fair panel generation, and heart-pounding sound design, Glass Rush delivers pure edge-of-your-seat entertainment.',
    rtp: '96.00%',
    volatility: 'Very High',
    releaseDate: '2024-09-30',
    devices: ['Desktop', 'Mobile', 'Tablet'],
    currencies: ['USD', 'EUR', 'GBP', 'KRW'],
    languages: ['English', 'Korean', 'Japanese', 'Chinese'],
    minBet: '$0.10',
    maxBet: '$500',
    maxWin: '32,768x',
    tags: ['arcade', 'survival', 'strategy'],
    status: 'featured',
    thumbnail: '/thumbs/glass-rush.svg',
    accentColor: '#06b6d4',
  },
  {
    id: 'multiplier-rush',
    slug: 'multiplier-rush',
    title: 'MULTIPLIER RUSH',
    filename: 'multiplier-rush.html',
    category: 'Crash',
    description: 'The pure crash game — watch the multiplier climb and cash out before the inevitable crash.',
    longDescription: 'MULTIPLIER RUSH is the definitive crash game — stripped back to its essential form. A multiplier starts at 1x and climbs indefinitely until it crashes at a provably fair random point. Players must cash out before the crash. Simple, addictive, and brutally honest. MULTIPLIER RUSH is engineered for maximum engagement with a minimal interface that keeps the focus exactly where it should be: on the multiplier.',
    rtp: '97.00%',
    volatility: 'Very High',
    releaseDate: '2024-05-15',
    devices: ['Desktop', 'Mobile', 'Tablet'],
    currencies: ['USD', 'EUR', 'GBP', 'BTC', 'ETH', 'LTC'],
    languages: ['English', 'Spanish', 'Portuguese', 'Russian', 'Turkish'],
    minBet: '$0.10',
    maxBet: '$1,000',
    maxWin: 'Unlimited',
    tags: ['crash', 'classic', 'multiplier'],
    status: 'active',
    thumbnail: '/thumbs/multiplier-rush.svg',
    accentColor: '#8b5cf6',
  },
  {
    id: 'train',
    slug: 'train',
    title: 'TRAIN',
    filename: 'train.html',
    category: 'Crash',
    description: 'Board the runaway train — it accelerates until it derails. Jump off at the right station.',
    longDescription: 'TRAIN is a crash game with a distinctive railway aesthetic that takes players on a relentless journey down an ever-accelerating track. Stations mark multiplier milestones — each one you pass increases the reward but brings you closer to the inevitable derailment. With a beautifully animated environment that shifts from daylight countryside to night cityscape as the multiplier climbs, TRAIN is the most atmospheric crash title in the catalog.',
    rtp: '97.00%',
    volatility: 'High',
    releaseDate: '2024-11-28',
    devices: ['Desktop', 'Mobile', 'Tablet'],
    currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    languages: ['English', 'German', 'French', 'Italian', 'Spanish'],
    minBet: '$0.10',
    maxBet: '$500',
    maxWin: '10,000x',
    tags: ['crash', 'atmospheric', 'unique'],
    status: 'new',
    thumbnail: '/thumbs/train.svg',
    accentColor: '#84cc16',
  },
];

export const categories = ['All', 'Crash', 'Arcade', 'Plinko', 'Minesweeper'];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find(g => g.slug === slug);
}

export function getGameById(id: string): Game | undefined {
  return games.find(g => g.id === id);
}

export function getGamesByCategory(category: string): Game[] {
  if (category === 'All') return games;
  return games.filter(g => g.category === category);
}

export function getFeaturedGames(): Game[] {
  return games.filter(g => g.status === 'featured');
}
