/**
 * Symbol tags and definitions for the Up Next app
 */

export interface Symbol {
  id: string;
  filename: string;
  displayName: string;
  tags: string[];
}

// Define all symbols with their metadata using tags
export const SYMBOLS: Symbol[] = [
  // Morning Routine related
  {
    id: 'get-dressed',
    filename: 'get dressed.png',
    displayName: 'Get Dressed',
    tags: ['Morning'],
  },
  {
    id: 'get-dressed-school',
    filename: 'get dressed for school.png',
    displayName: 'Get Dressed for School',
    tags: ['Morning'],
  },
  {
    id: 'brush-teeth',
    filename: 'brush teeth girl.png',
    displayName: 'Brush Teeth',
    tags: ['Morning', 'Bedtime'],
  },
  {
    id: 'brush-hair',
    filename: 'brush hair.png',
    displayName: 'Brush Hair',
    tags: ['Morning'],
  },
  {
    id: 'toilet',
    filename: 'toilet.png',
    displayName: 'Toilet',
    tags: ['Morning', 'Bedtime'],
  },
  
  // Mealtime related
  {
    id: 'cheese-toast',
    filename: 'cheese on toast.png',
    displayName: 'Cheese on Toast',
    tags: ['Food'],
  },
  {
    id: 'dinner-time',
    filename: 'dinner time.png',
    displayName: 'Dinner Time',
    tags: ['Food'],
  },
  {
    id: 'dinner',
    filename: 'dinner.png',
    displayName: 'Dinner',
    tags: ['Food'],
  },
  {
    id: 'bottle',
    filename: 'bottle.png',
    displayName: 'Bottle',
    tags: ['Food'],
  },
  
  // Bedtime related
  {
    id: 'bath',
    filename: 'bath.png',
    displayName: 'Bath',
    tags: ['Bedtime'],
  },
  {
    id: 'pyjamas',
    filename: 'pyjamas.png',
    displayName: 'Pyjamas',
    tags: ['Bedtime'],
  },
  {
    id: 'bedtime-song',
    filename: 'bedtime song.png',
    displayName: 'Bedtime Song',
    tags: ['Bedtime'],
  },
  {
    id: 'bedtime-song-bunk',
    filename: 'bedtime song bunk beds.png',
    displayName: 'Bedtime Song (Bunk Beds)',
    tags: ['Bedtime'],
  },
  {
    id: 'bunk-beds',
    filename: 'bunk beds.png',
    displayName: 'Bunk Beds',
    tags: ['Bedtime'],
  },
  {
    id: 'sleep',
    filename: 'sleep.png',
    displayName: 'Sleep',
    tags: ['Bedtime'],
  },
  {
    id: 'sleep-bunk-beds',
    filename: 'sleep in bunk beds.png',
    displayName: 'Sleep in Bunk Beds',
    tags: ['Bedtime'],
  },
  {
    id: 'dream-machine',
    filename: 'dream machine.png',
    displayName: 'Dream Machine',
    tags: ['Bedtime'],
  },
  
  // Activities related (Now 'Outings')
  {
    id: 'car',
    filename: 'car.png',
    displayName: 'Car',
    tags: ['Outings'],
  },
  {
    id: 'train',
    filename: 'train.png',
    displayName: 'Train',
    tags: ['Outings'],
  },
  {
    id: 'pushchair',
    filename: 'pushchair.png',
    displayName: 'Pushchair',
    tags: ['Outings'],
  },
  {
    id: 'ipad',
    filename: 'ipad.png',
    displayName: 'iPad',
    tags: ['Outings'],
  },
  {
    id: 'playground',
    filename: 'playground.png',
    displayName: 'playground',
    tags: ['Outings'],
  },
  {
    id: 'ice-lolly',
    filename: 'ice lolly.png',
    displayName: 'Ice Lolly',
    tags: ['Food'],
  },
  {
    id: 'easter-egg',
    filename: 'easter egg.png',
    displayName: 'Easter Egg',
    tags: ['Food', 'Outings'],
  },
  {
    id: 'entertainment',
    filename: 'entertainment.png',
    displayName: 'Entertainment',
    tags: ['Outings'],
  },
  {
    id: 'cottage',
    filename: 'cottage.png',
    displayName: 'Cottage',
    tags: ['Outings'],
  },
  {
    id: 'chloe',
    filename: 'Chloe.png',
    displayName: 'Chloe',
    tags: ['People'],
  },
  {
    id: 'mcdonalds',
    filename: 'McDonalds.png',
    displayName: 'McDonald\'s',
    tags: ['Food'],
  },
  {
    id: 'finished',
    filename: 'finished.png',
    displayName: 'Finished',
    tags: [],
  },
  {
    id: 'blackpool',
    filename: 'blackpool.png',
    displayName: 'Blackpool',
    tags: ['Outings'],
  },
  {
    id: 'izzi',
    filename: 'izzi.png',
    displayName: 'Izzi',
    tags: ['People'],
  },
  {
    id: 'cinema',
    filename: 'cinema.png',
    displayName: 'Cinema',
    tags: ['Outings'],
  },
  {
    id: 'trim-fringe',
    filename: 'trim fringe.png',
    displayName: 'Trim Fringe',
    tags: ['Morning'],
  },
];

// Helper functions
export const getSymbolByFilename = (filename: string): Symbol | undefined => {
  return SYMBOLS.find(symbol => symbol.filename === filename);
};

export const getSymbolById = (id: string): Symbol | undefined => {
  return SYMBOLS.find(symbol => symbol.id === id);
};

// Renamed and updated to filter by tag
export const getSymbolsByTag = (tag: string): Symbol[] => {
  return SYMBOLS.filter(symbol => symbol.tags.includes(tag));
};

// Renamed and updated to get all unique tags
export const getAllTags = (): string[] => {
  const allTags = new Set<string>();
  SYMBOLS.forEach(symbol => {
    symbol.tags.forEach(tag => allTags.add(tag));
  });
  return Array.from(allTags).sort();
};

export const getAllFilenames = (): string[] => {
  return SYMBOLS.map(symbol => symbol.filename);
};