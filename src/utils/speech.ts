// speech.ts - Utility for speech synthesis with Siri voice support for iOS

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  cancelExisting?: boolean;
}

// Cache the SpeechSynthesis instance
const synth = window.speechSynthesis;
let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Detect if the device is running iOS
 * @returns boolean indicating if the current device is iOS
 */
export const isIOS = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor;
  return /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
};

/**
 * Get the best Siri voice available on the device
 * @returns SpeechSynthesisVoice or undefined if no Siri voice is available
 */
export const getSiriVoice = (): SpeechSynthesisVoice | undefined => {
  // Ensure voices are loaded
  const voices = synth.getVoices();
  
  // iOS Siri voices are typically identified by these patterns
  const siriVoicePatterns = [
    /^Samantha/i,     // US female Siri voice
    /^Daniel/i,       // British male Siri voice
    /^Karen/i,        // Australian female Siri voice
    /^Moira/i,        // Irish female Siri voice
    /^Tessa/i,        // South African female Siri voice
    /^Siri/i          // Generic match for any Siri voice
  ];
  
  // First try to find a voice that explicitly contains "Siri" in the name
  let siriVoice = voices.find(voice => 
    voice.name.includes('Siri') && voice.lang.startsWith('en')
  );
  
  // If no explicit Siri voice found, try the common Siri voice names
  if (!siriVoice) {
    for (const pattern of siriVoicePatterns) {
      siriVoice = voices.find(voice => 
        pattern.test(voice.name) && voice.lang.startsWith('en')
      );
      if (siriVoice) break;
    }
  }
  
  // Fallback to any en-US voice if no Siri voice found
  if (!siriVoice) {
    siriVoice = voices.find(voice => voice.lang === 'en-US');
  }
  
  return siriVoice;
};

/**
 * Speak text aloud using the Siri voice on iOS devices or default voice on other devices
 * @param text - The text to speak
 * @param options - Optional configuration for speech rate, pitch, volume, etc.
 */
export const speakWithSiri = (text: string, options: SpeechOptions = {}): void => {
  if (!synth) return;
  
  // Cancel any ongoing speech if requested
  if (options.cancelExisting && currentUtterance) {
    synth.cancel();
  }
  
  // Create a new utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set default options
  utterance.rate = options.rate ?? 1.0;
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;
  
  // Use Siri voice on iOS devices
  if (isIOS()) {
    // Wait for voices to be loaded if needed
    if (synth.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const siriVoice = getSiriVoice();
        if (siriVoice) {
          utterance.voice = siriVoice;
        }
        synth.speak(utterance);
      };
    } else {
      const siriVoice = getSiriVoice();
      if (siriVoice) {
        utterance.voice = siriVoice;
      }
      synth.speak(utterance);
    }
  } else {
    // Use default voice on non-iOS devices
    synth.speak(utterance);
  }
  
  // Store the current utterance
  currentUtterance = utterance;
  
  // Clear the reference when speech ends
  utterance.onend = () => {
    currentUtterance = null;
  };
};

/**
 * Stop any ongoing speech
 */
export const stopSpeech = (): void => {
  if (synth) {
    synth.cancel();
    currentUtterance = null;
  }
};