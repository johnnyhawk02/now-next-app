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
    tags: ['morning', 'clothing'],
  },
  {
    id: 'get-dressed-school',
    filename: 'get dressed for school.png',
    displayName: 'Get Dressed for School',
    tags: ['morning', 'clothing', 'school'],
  },
  {
    id: 'brush-teeth',
    filename: 'brush teeth girl.png',
    displayName: 'Brush Teeth',
    tags: ['morning', 'bedtime', 'hygiene'],
  },
  {
    id: 'brush-hair',
    filename: 'brush hair.png',
    displayName: 'Brush Hair',
    tags: ['morning', 'hygiene'],
  },
  {
    id: 'toilet',
    filename: 'toilet.png',
    displayName: 'Toilet',
    tags: ['routine', 'hygiene'],
  },
  
  // Mealtime related
  {
    id: 'cheese-toast',
    filename: 'cheese on toast.png',
    displayName: 'Cheese on Toast',
    tags: ['mealtime', 'food'],
  },
  {
    id: 'dinner-time',
    filename: 'dinner time.png',
    displayName: 'Dinner Time',
    tags: ['mealtime', 'food'],
  },
  {
    id: 'dinner',
    filename: 'dinner.png',
    displayName: 'Dinner',
    tags: ['mealtime', 'food'],
  },
  {
    id: 'bottle',
    filename: 'bottle.png',
    displayName: 'Bottle',
    tags: ['mealtime', 'drink'],
  },
  
  // Bedtime related
  {
    id: 'bath',
    filename: 'bath.png',
    displayName: 'Bath',
    tags: ['bedtime', 'hygiene'],
  },
  {
    id: 'pyjamas',
    filename: 'pyjamas.png',
    displayName: 'Pyjamas',
    tags: ['bedtime', 'clothing'],
  },
  {
    id: 'bedtime-song',
    filename: 'bedtime song.png',
    displayName: 'Bedtime Song',
    tags: ['bedtime', 'music'],
  },
  {
    id: 'bedtime-song-bunk',
    filename: 'bedtime song bunk beds.png',
    displayName: 'Bedtime Song (Bunk Beds)',
    tags: ['bedtime', 'music'],
  },
  {
    id: 'bunk-beds',
    filename: 'bunk beds.png',
    displayName: 'Bunk Beds',
    tags: ['bedtime', 'sleep'],
  },
  {
    id: 'sleep',
    filename: 'sleep.png',
    displayName: 'Sleep',
    tags: ['bedtime', 'sleep'],
  },
  {
    id: 'sleep-bunk-beds',
    filename: 'sleep in bunk beds.png',
    displayName: 'Sleep in Bunk Beds',
    tags: ['bedtime', 'sleep'],
  },
  {
    id: 'dream-machine',
    filename: 'dream machine.png',
    displayName: 'Dream Machine',
    tags: ['bedtime', 'sleep', 'sensory'],
  },
  
  // Activities related
  {
    id: 'car',
    filename: 'car.png',
    displayName: 'Car',
    tags: ['activity', 'transport'],
  },
  {
    id: 'train',
    filename: 'train.png',
    displayName: 'Train',
    tags: ['activity', 'transport'],
  },
  {
    id: 'pushchair',
    filename: 'pushchair.png',
    displayName: 'Pushchair',
    tags: ['activity', 'transport', 'outside'],
  },
  {
    id: 'ipad',
    filename: 'ipad.png',
    displayName: 'iPad',
    tags: ['activity', 'play', 'screentime'],
  },
  {
    id: 'playground',
    filename: 'playground.png',
    displayName: 'playground',
    tags: ['activity', 'play', 'outside'],
  },
  {
    id: 'ice-lolly',
    filename: 'ice lolly.png',
    displayName: 'Ice Lolly',
    tags: ['activity', 'food', 'treat'],
  },
  {
    id: 'easter-egg',
    filename: 'easter egg.png',
    displayName: 'Easter Egg',
    tags: ['activity', 'food', 'treat', 'holiday'],
  },
  {
    id: 'entertainment',
    filename: 'entertainment.png',
    displayName: 'Entertainment',
    tags: ['activity', 'play', 'screentime'],
  },
  {
    id: 'cottage',
    filename: 'cottage.png',
    displayName: 'Cottage',
    tags: ['activity', 'place', 'holiday'],
  },
  {
    id: 'chloe',
    filename: 'Chloe.png',
    displayName: 'Chloe',
    tags: ['person', 'family'],
  },
  {
    id: 'mcdonalds',
    filename: 'McDonalds.png',
    displayName: 'McDonald\'s',
    tags: ['activity', 'mealtime', 'food', 'treat'],
  },
  {
    id: 'finished',
    filename: 'finished.png',
    displayName: 'Finished',
    tags: ['general', 'routine'],
  },
  {
    id: 'blackpool',
    filename: 'blackpool.png',
    displayName: 'Blackpool',
    tags: ['activity', 'place', 'holiday'],
  },
  {
    id: 'izzi',
    filename: 'izzi.png',
    displayName: 'Izzi',
    tags: ['person', 'family'],
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