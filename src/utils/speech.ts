// speech.ts - Simple utility for playing pre-generated audio files

/**
 * Play pre-generated audio for a given word using files from the public/audio directory
 * @param word - The word to play audio for (filename without extension)
 */
export const playAudioForWord = (word: string): void => {
  // Convert the word to lowercase and ensure it matches the filenames in the audio directory
  const formattedWord = word.toLowerCase();
  
  // Use the correct path to audio files
  const audioPath = `/audio/${formattedWord}.mp3`;
  
  console.log(`Playing audio from: ${audioPath}`);
  const audio = new Audio(audioPath);
  
  audio.play().catch((error) => {
    console.error(`Failed to play audio for word: ${word}`, error);
  });
};