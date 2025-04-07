/**
 * Predefined sequences of activities for common routines
 */

export interface Sequence {
  id: string;
  name: string;
  description?: string;
  symbolIds: string[]; // ids from the symbols.ts file
}

export const SEQUENCES: Sequence[] = [
  {
    id: 'bedtime-routine',
    name: 'Bedtime Routine',
    description: 'Evening routine to prepare for sleep',
    symbolIds: [
      'dinner', // Dinner
      'toilet', // Toilet
      'bath', // Bath time
      'pyjamas', // Get dressed (pyjamas)
      'ipad', // iPad time
      'brush-teeth', // Brush teeth
      'bedtime-song', // Bedtime song
      'dream-machine', // Dream machine
      'sleep', // Sleep
      'finished', // All done
    ]
  },
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    description: 'Morning preparation routine',
    symbolIds: [
      'toilet', // Toilet
      'brush-teeth', // Brush teeth
      'brush-hair', // Brush hair
      'get-dressed', // Get dressed
      'bottle', // Breakfast/bottle
      'pushchair', // Ready to go out
      'finished', // All done
    ]
  },
  {
    id: 'mealtime-routine',
    name: 'Mealtime',
    description: 'Typical meal routine',
    symbolIds: [
      'dinner-time', // Dinner time
      'cheese-toast', // Cheese on toast
      'toilet', // Toilet after meal
      'bottle', // Drink
      'finished', // All done
    ]
  }
];

// Add 'finished' to the end of all sequences
SEQUENCES.forEach(sequence => {
  if (!sequence.symbolIds.includes('finished')) {
    sequence.symbolIds.push('finished');
  }
});

// Helper functions
export const getSequenceById = (id: string): Sequence | undefined => {
  return SEQUENCES.find(sequence => sequence.id === id);
};

export const getAllSequences = (): Sequence[] => {
  return SEQUENCES;
};