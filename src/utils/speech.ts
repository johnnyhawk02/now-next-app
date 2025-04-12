// speech.ts - Simple utility for playing pre-generated audio files

/**
 * Play pre-generated audio for a given word using files from the public/audio directory
 * @param word - The word to play audio for (filename without extension)
 * @returns A Promise that resolves when the audio starts playing, or rejects if playback fails
 */
export const playAudioForWord = (word: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!word) {
      console.error('No word provided for audio playback');
      reject(new Error('No word provided'));
      return;
    }
    
    // Process input to handle various formats
    let processedWord = word;
    
    // Handle VS Code explorer clicks - extract filename from path if needed
    if (word.includes('/') || word.includes('\\')) {
      const parts = word.split(/[/\\]/);
      processedWord = parts[parts.length - 1];
    }
    
    // Remove .mp3 extension if it exists (from VS Code explorer clicks)
    if (processedWord.toLowerCase().endsWith('.mp3')) {
      processedWord = processedWord.slice(0, -4);
    }
    
    console.log(`Processing audio request for: ${processedWord}`);
    
    // Try the original case first (for proper nouns like "Chloe")
    let audioPath = `/audio/${processedWord}.mp3`;
    
    // Create an audio element
    const audio = new Audio(audioPath);
    
    // Add event listeners for success and error
    audio.onplay = () => {
      console.log(`Playing audio for: ${processedWord}`);
      resolve();
    };
    
    audio.onerror = () => {
      console.log(`Failed to play audio with original case, trying lowercase: ${processedWord}`);
      
      // Try lowercase version as fallback
      const formattedWord = processedWord.toLowerCase();
      
      // Only try lowercase if it's different from the original
      if (formattedWord === processedWord) {
        console.error(`Failed to play audio for word: ${processedWord}`);
        reject(new Error(`Audio not found for: ${processedWord}`));
        return;
      }
      
      const fallbackPath = `/audio/${formattedWord}.mp3`;
      const fallbackAudio = new Audio(fallbackPath);
      
      fallbackAudio.onplay = () => {
        console.log(`Playing audio for: ${formattedWord} (lowercase fallback)`);
        resolve();
      };
      
      fallbackAudio.onerror = (fallbackError) => {
        console.error(`Failed to play audio for word: ${processedWord} (tried both cases)`, fallbackError);
        reject(new Error(`Audio not found for: ${processedWord}`));
      };
      
      fallbackAudio.play().catch((error) => {
        console.error(`Caught error playing fallback audio for: ${processedWord}`, error);
        reject(error);
      });
    };
    
    // Attempt to play the audio with original case
    audio.play().catch((error) => {
      // The onerror handler will take care of the fallback logic
      console.log(`Caught error playing audio with original case: ${error.message}`);
    });
  });
};