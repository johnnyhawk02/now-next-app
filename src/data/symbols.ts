/**
 * Symbol categories and definitions for the Now & Next app
 */

export interface Symbol {
  id: string;
  filename: string;
  displayName: string;
  categories: string[];
}

// Define all available categories
export const CATEGORIES = {
  MORNING: 'Morning Routine',
  MEALTIME: 'Mealtime',
  BEDTIME: 'Bedtime',
  ACTIVITIES: 'Activities',
};

// Define all symbols with their metadata
export const SYMBOLS: Symbol[] = [
  // Morning Routine
  {
    id: 'get-dressed',
    filename: 'get dressed.png',
    displayName: 'Get Dressed',
    categories: [CATEGORIES.MORNING],
  },
  {
    id: 'get-dressed-school',
    filename: 'get dressed for school.png',
    displayName: 'Get Dressed for School',
    categories: [CATEGORIES.MORNING],
  },
  {
    id: 'brush-teeth',
    filename: 'brush teeth girl.png',
    displayName: 'Brush Teeth',
    categories: [CATEGORIES.MORNING, CATEGORIES.BEDTIME],
  },
  {
    id: 'brush-hair',
    filename: 'brush hair.png',
    displayName: 'Brush Hair',
    categories: [CATEGORIES.MORNING],
  },
  {
    id: 'toilet',
    filename: 'toilet.png',
    displayName: 'Toilet',
    categories: [CATEGORIES.MORNING, CATEGORIES.MEALTIME, CATEGORIES.BEDTIME, CATEGORIES.ACTIVITIES],
  },
  
  // Mealtime
  {
    id: 'cheese-toast',
    filename: 'cheese on toast.png',
    displayName: 'Cheese on Toast',
    categories: [CATEGORIES.MEALTIME],
  },
  {
    id: 'dinner-time',
    filename: 'dinner time.png',
    displayName: 'Dinner Time',
    categories: [CATEGORIES.MEALTIME],
  },
  {
    id: 'dinner',
    filename: 'dinner.png',
    displayName: 'Dinner',
    categories: [CATEGORIES.MEALTIME],
  },
  {
    id: 'bottle',
    filename: 'bottle.png',
    displayName: 'Bottle',
    categories: [CATEGORIES.MORNING, CATEGORIES.MEALTIME, CATEGORIES.BEDTIME, CATEGORIES.ACTIVITIES],
  },
  
  // Bedtime
  {
    id: 'bath',
    filename: 'bath.png',
    displayName: 'Bath',
    categories: [CATEGORIES.BEDTIME],
  },
  {
    id: 'pyjamas',
    filename: 'pyjamas.png',
    displayName: 'Pyjamas',
    categories: [CATEGORIES.BEDTIME],
  },
  {
    id: 'bedtime-song',
    filename: 'bedtime song.png',
    displayName: 'Bedtime Song',
    categories: [CATEGORIES.BEDTIME],
  },
  {
    id: 'bedtime-song-bunk',
    filename: 'bedtime song bunk beds.png',
    displayName: 'Bedtime Song (Bunk Beds)',
    categories: [CATEGORIES.BEDTIME],
  },
  {
    id: 'bunk-beds',
    filename: 'bunk beds.png',
    displayName: 'Bunk Beds',
    categories: [CATEGORIES.BEDTIME],
  },
  {
    id: 'sleep',
    filename: 'sleep.png',
    displayName: 'Sleep',
    categories: [CATEGORIES.BEDTIME],
  },
  {
    id: 'sleep-bunk-beds',
    filename: 'sleep in bunk beds.png',
    displayName: 'Sleep in Bunk Beds',
    categories: [CATEGORIES.BEDTIME],
  },
  {
    id: 'dream-machine',
    filename: 'dream machine.png',
    displayName: 'Dream Machine',
    categories: [CATEGORIES.BEDTIME],
  },
  
  // Activities
  {
    id: 'car',
    filename: 'car.png',
    displayName: 'Car',
    categories: [CATEGORIES.ACTIVITIES],
  },
  {
    id: 'train',
    filename: 'train.png',
    displayName: 'Train',
    categories: [CATEGORIES.ACTIVITIES],
  },
  {
    id: 'pushchair',
    filename: 'pushchair.png',
    displayName: 'Pushchair',
    categories: [CATEGORIES.ACTIVITIES, CATEGORIES.MORNING],
  },
  {
    id: 'ipad',
    filename: 'ipad.png',
    displayName: 'iPad',
    categories: [CATEGORIES.ACTIVITIES],
  },
  {
    id: 'ice-lolly',
    filename: 'ice lolly.png',
    displayName: 'Ice Lolly',
    categories: [CATEGORIES.ACTIVITIES],
  },
  {
    id: 'easter-egg',
    filename: 'easter egg.png',
    displayName: 'Easter Egg',
    categories: [CATEGORIES.ACTIVITIES],
  },
  {
    id: 'chloe',
    filename: 'Chloe.png',
    displayName: 'Chloe',
    categories: [CATEGORIES.ACTIVITIES],
  },
  {
    id: 'finished',
    filename: 'finished.png',
    displayName: 'Finished',
    categories: [CATEGORIES.ACTIVITIES],
  },

];

// Helper functions
export const getSymbolByFilename = (filename: string): Symbol | undefined => {
  return SYMBOLS.find(symbol => symbol.filename === filename);
};

export const getSymbolById = (id: string): Symbol | undefined => {
  return SYMBOLS.find(symbol => symbol.id === id);
};

export const getSymbolsByCategory = (category: string): Symbol[] => {
  return SYMBOLS.filter(symbol => symbol.categories.includes(category));
};

export const getAllCategories = (): string[] => {
  return Object.values(CATEGORIES);
};

export const getAllFilenames = (): string[] => {
  return SYMBOLS.map(symbol => symbol.filename);
};