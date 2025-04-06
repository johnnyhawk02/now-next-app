// speech.ts - Utility for speech synthesis with Siri voice support for iOS

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  cancelExisting?: boolean;
  voiceName?: string; // Added option to specify voice by name
  lang?: string;      // Added option to specify language
  onStart?: () => void;  // Callback when speech starts
  onEnd?: () => void;    // Callback when speech ends
  onError?: (error: SpeechSynthesisErrorEvent) => void; // Callback for errors
}

// Additional interface for voice search criteria
interface VoiceSearchCriteria {
  lang?: string;
  name?: string;
  localService?: boolean;
  isEnhanced?: boolean; // Some browsers report enhanced quality voices
  gender?: 'male' | 'female' | 'neutral';
}

// Speech queue implementation
interface QueuedSpeech {
  text: string;
  options: SpeechOptions;
}

// Cache the SpeechSynthesis instance
const synth = window.speechSynthesis;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let voicesLoaded = false;
let speechQueue: QueuedSpeech[] = [];
let isSpeaking = false;

/**
 * Check if speech synthesis is available in the browser
 * @returns boolean indicating if speech synthesis is supported
 */
export const isSpeechAvailable = (): boolean => {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

/**
 * Detect if the device is running iOS
 * @returns boolean indicating if the current device is iOS
 */
export const isIOS = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor;
  return /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
};

/**
 * Detect if the device is running macOS
 * @returns boolean indicating if the current device is macOS
 */
export const isMacOS = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor;
  return /Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent);
};

/**
 * Ensure voices are loaded and return a promise that resolves when they are
 */
const ensureVoicesLoaded = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    const voices = synth.getVoices();
    if (voices.length > 0) {
      voicesLoaded = true;
      resolve(voices);
    } else {
      // Set up a one-time event listener for voices changed
      const voicesChangedHandler = () => {
        voicesLoaded = true;
        synth.removeEventListener('voiceschanged', voicesChangedHandler);
        resolve(synth.getVoices());
      };
      synth.addEventListener('voiceschanged', voicesChangedHandler);
      
      // Safety timeout in case the event never fires
      setTimeout(() => {
        if (!voicesLoaded) {
          synth.removeEventListener('voiceschanged', voicesChangedHandler);
          resolve(synth.getVoices());
        }
      }, 1000);
    }
  });
};

/**
 * Get all available voices with an optional filter by language
 * @param langPrefix Optional language prefix (e.g., 'en' for English voices)
 * @returns Promise resolving to an array of available voices
 */
export const getAvailableVoices = async (langPrefix?: string): Promise<SpeechSynthesisVoice[]> => {
  const voices = await ensureVoicesLoaded();
  if (langPrefix) {
    return voices.filter(voice => voice.lang.startsWith(langPrefix));
  }
  return voices;
};

/**
 * Get the best Siri voice available on the device
 * @returns Promise resolving to SpeechSynthesisVoice or undefined if no Siri voice is available
 */
export const getSiriVoice = async (): Promise<SpeechSynthesisVoice | undefined> => {
  // Ensure voices are loaded
  const voices = await ensureVoicesLoaded();
  
  // For debugging - log all available voices
  console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`).join(', '));
  
  // iOS/macOS Siri voice identification - expanded patterns
  const siriVoiceCandidates = [
    // Direct Siri voice matches
    voices.find(voice => voice.name.includes('Siri') && voice.lang.startsWith('en')),
    
    // Common Siri voice names in different iOS versions
    voices.find(voice => /^Samantha/.test(voice.name) && voice.lang.startsWith('en')),
    voices.find(voice => /^Daniel/.test(voice.name) && voice.lang.startsWith('en')),
    voices.find(voice => /^Karen/.test(voice.name) && voice.lang.startsWith('en')),
    voices.find(voice => /^Moira/.test(voice.name) && voice.lang.startsWith('en')),
    voices.find(voice => /^Tessa/.test(voice.name) && voice.lang.startsWith('en')),
    
    // Added more common Apple premium voices
    voices.find(voice => /^Alex/.test(voice.name) && voice.lang.startsWith('en')),
    voices.find(voice => /^Ava/.test(voice.name) && voice.lang.startsWith('en')),
    voices.find(voice => /^Fred/.test(voice.name) && voice.lang.startsWith('en')),
    voices.find(voice => /^Victoria/.test(voice.name) && voice.lang.startsWith('en')),
    
    // Match any of the enhanced Apple voices which are typically Siri-like
    ...voices.filter(voice => 
      voice.name.includes('Apple') && 
      voice.lang.startsWith('en') && 
      (voice.name.includes('Enhanced') || voice.localService === true)
    ),
    
    // Any local service voice from Apple is likely a high quality voice
    ...voices.filter(voice => 
      voice.localService === true && 
      voice.lang.startsWith('en') && 
      voice.name.includes('Apple')
    ),
  ];
  
  // Return the first non-undefined voice
  const siriVoice = siriVoiceCandidates.find(voice => voice !== undefined);
  
  // Log the selected voice for debugging
  if (siriVoice) {
    console.log('Selected Siri voice:', siriVoice.name, siriVoice.lang);
  } else {
    console.log('No suitable Siri voice found, using default');
  }
  
  // Fallback to any en-US voice if no Siri voice found
  if (!siriVoice) {
    return voices.find(voice => voice.lang === 'en-US');
  }
  
  return siriVoice;
};

/**
 * Get a specific voice by name or partial name match
 * @param name The name of the voice to search for
 * @param lang Optional language filter
 * @returns Promise resolving to the matching voice or undefined if not found
 */
export const getVoiceByName = async (name: string, lang?: string): Promise<SpeechSynthesisVoice | undefined> => {
  const voices = await ensureVoicesLoaded();
  
  // Filter by language if specified
  const langFilteredVoices = lang 
    ? voices.filter(voice => voice.lang.startsWith(lang))
    : voices;
  
  // Try exact match first
  let matchedVoice = langFilteredVoices.find(voice => 
    voice.name.toLowerCase() === name.toLowerCase()
  );
  
  // If no exact match, try partial match
  if (!matchedVoice) {
    matchedVoice = langFilteredVoices.find(voice => 
      voice.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  
  return matchedVoice;
};

/**
 * Process the next item in the speech queue
 */
const processNextInQueue = (): void => {
  if (!isSpeaking && speechQueue.length > 0) {
    const next = speechQueue.shift();
    if (next) {
      isSpeaking = true;
      speakWithSiri(next.text, {
        ...next.options,
        onEnd: () => {
          isSpeaking = false;
          if (next.options.onEnd) next.options.onEnd();
          processNextInQueue();
        },
        onError: (error) => {
          isSpeaking = false;
          if (next.options.onError) next.options.onError(error);
          processNextInQueue();
        }
      });
    }
  }
};

/**
 * Add speech to the queue
 * @param text - The text to speak
 * @param options - Optional configuration for speech
 */
export const queueSpeech = (text: string, options: SpeechOptions = {}): void => {
  speechQueue.push({ text, options });
  
  // If not currently speaking, process the queue
  if (!isSpeaking) {
    processNextInQueue();
  }
};

/**
 * Clear the speech queue
 */
export const clearSpeechQueue = (): void => {
  speechQueue = [];
};

/**
 * Get the current speech queue length
 * @returns Number of items in the speech queue
 */
export const getSpeechQueueLength = (): number => {
  return speechQueue.length;
};

/**
 * Speak text aloud using the Siri voice on iOS devices or default voice on other devices
 * @param text - The text to speak
 * @param options - Optional configuration for speech rate, pitch, volume, etc.
 */
export const speakWithSiri = async (text: string, options: SpeechOptions = {}): Promise<void> => {
  if (!synth) return;
  
  // Cancel any ongoing speech if requested or by default
  if ((options.cancelExisting !== false) && currentUtterance) {
    synth.cancel();
  }
  
  // Create a new utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set default options
  utterance.rate = options.rate ?? 0.95; // Slightly slower for better clarity
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;
  
  // Set language if specified
  if (options.lang) {
    utterance.lang = options.lang;
  }
  
  // If specific voice name provided, try to use it
  if (options.voiceName) {
    try {
      const requestedVoice = await getVoiceByName(options.voiceName, options.lang);
      if (requestedVoice) {
        utterance.voice = requestedVoice;
      } else {
        console.warn(`Voice "${options.voiceName}" not found. Using default voice.`);
      }
    } catch (err) {
      console.error('Error setting requested voice:', err);
    }
  }
  // Otherwise use Siri voice on iOS/macOS devices
  else if (isIOS() || isMacOS()) {
    try {
      const siriVoice = await getSiriVoice();
      if (siriVoice) {
        utterance.voice = siriVoice;
      }
    } catch (err) {
      console.error('Error getting Siri voice:', err);
    }
  }
  
  // Store the current utterance before speaking
  currentUtterance = utterance;
  
  // Set up event handlers
  if (options.onStart) {
    utterance.onstart = options.onStart;
  }
  
  utterance.onend = () => {
    currentUtterance = null;
    if (options.onEnd) options.onEnd();
  };
  
  utterance.onerror = (err) => {
    console.error('Speech synthesis error:', err);
    currentUtterance = null;
    if (options.onError) options.onError(err);
  };
  
  // Add some debugging information
  console.log(`Speaking with voice: ${utterance.voice?.name || 'default'} (${utterance.voice?.lang || utterance.lang})`);
  
  // Speak the text
  synth.speak(utterance);
};

/**
 * Stop any ongoing speech and clear the queue
 * @param clearQueue - Whether to also clear the speech queue (default: true)
 */
export const stopSpeech = (clearQueue = true): void => {
  if (synth) {
    synth.cancel();
    currentUtterance = null;
    isSpeaking = false;
    
    if (clearQueue) {
      clearSpeechQueue();
    }
  }
};

/**
 * Search for voices matching certain criteria
 * @param criteria Object containing search criteria
 * @returns Promise resolving to an array of matching voices
 */
export const searchVoices = async (criteria: VoiceSearchCriteria): Promise<SpeechSynthesisVoice[]> => {
  const voices = await ensureVoicesLoaded();
  
  return voices.filter(voice => {
    // Match language prefix if specified
    if (criteria.lang && !voice.lang.startsWith(criteria.lang)) {
      return false;
    }
    
    // Match name if specified
    if (criteria.name && !voice.name.toLowerCase().includes(criteria.name.toLowerCase())) {
      return false;
    }
    
    // Match local service if specified
    if (criteria.localService !== undefined && voice.localService !== criteria.localService) {
      return false;
    }
    
    // Try to match enhanced quality voices (this property isn't standard but some browsers have it)
    if (criteria.isEnhanced && !voice.name.toLowerCase().includes('enhanced')) {
      // This is not a standard property, so we check via name as a fallback
      // @ts-ignore - Some browsers might have a non-standard quality property
      const quality = (voice as any).quality;
      if (quality && quality !== 'enhanced') {
        return false;
      }
    }
    
    // Some browsers expose voice gender, though it's not standard
    if (criteria.gender) {
      // @ts-ignore - Some browsers might have this non-standard property
      const voiceGender = (voice as any).gender;
      if (voiceGender && voiceGender !== criteria.gender) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Populate a select element with available speech voices
 * @param selectElement The select element to populate
 * @param langFilter Optional language filter (e.g., 'en')
 * @param selectedVoiceName Optional name of voice to select by default
 */
export const populateVoiceSelect = async (
  selectElement: HTMLSelectElement, 
  langFilter?: string,
  selectedVoiceName?: string
): Promise<void> => {
  // Clear existing options
  selectElement.innerHTML = '';
  
  try {
    // Get all available voices, filtered by language if specified
    const voices = await getAvailableVoices(langFilter);
    
    // Group voices by language for better organization
    const voicesByLang: { [lang: string]: SpeechSynthesisVoice[] } = {};
    
    voices.forEach(voice => {
      const langCode = voice.lang.split('-')[0]; // Get the base language code (e.g., 'en' from 'en-US')
      if (!voicesByLang[langCode]) {
        voicesByLang[langCode] = [];
      }
      voicesByLang[langCode].push(voice);
    });
    
    // Create a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = '-- Select Voice --';
    selectElement.appendChild(defaultOption);
    
    // Add options grouped by language
    Object.keys(voicesByLang).sort().forEach(langCode => {
      // Create an optgroup for the language
      const group = document.createElement('optgroup');
      group.label = new Intl.DisplayNames([navigator.language], { type: 'language' }).of(langCode) || langCode;
      
      // Sort voices within each language group
      const langVoices = voicesByLang[langCode].sort((a, b) => a.name.localeCompare(b.name));
      
      // Add voice options to the group
      langVoices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        
        // Show additional info about the voice
        let localBadge = voice.localService ? ' [Local]' : '';
        let qualityBadge = voice.name.includes('Enhanced') ? ' [Enhanced]' : '';
        
        option.text = `${voice.name} (${voice.lang})${localBadge}${qualityBadge}`;
        option.dataset.lang = voice.lang;
        
        // Set as selected if it matches the selected voice name
        if (selectedVoiceName && voice.name === selectedVoiceName) {
          option.selected = true;
        }
        
        group.appendChild(option);
      });
      
      selectElement.appendChild(group);
    });
    
    // If no selected voice was specified, try to select Siri voice by default on Apple devices
    if (!selectedVoiceName && (isIOS() || isMacOS())) {
      const siriVoice = await getSiriVoice();
      if (siriVoice) {
        // Find and select the option with this voice
        for (let i = 0; i < selectElement.options.length; i++) {
          if (selectElement.options[i].value === siriVoice.name) {
            selectElement.selectedIndex = i;
            break;
          }
        }
      }
    }
  } catch (err) {
    console.error('Error populating voice select:', err);
    
    // Add a fallback option
    const errorOption = document.createElement('option');
    errorOption.value = '';
    errorOption.text = 'Voices not available';
    selectElement.appendChild(errorOption);
  }
};

/**
 * Helper function to demonstrate available voices
 * Useful for UI development and testing
 */
export const logAllAvailableVoices = async (): Promise<void> => {
  const voices = await ensureVoicesLoaded();
  console.log('=== All Available Voices ===');
  voices.forEach((voice, index) => {
    console.log(`${index + 1}. ${voice.name} (${voice.lang})${voice.localService ? ' - Local' : ' - Network'}`);
  });
  
  // Group by language
  const voicesByLang: Record<string, SpeechSynthesisVoice[]> = {};
  voices.forEach(voice => {
    if (!voicesByLang[voice.lang]) {
      voicesByLang[voice.lang] = [];
    }
    voicesByLang[voice.lang].push(voice);
  });
  
  console.log('=== Voices By Language ===');
  Object.entries(voicesByLang).forEach(([lang, voiceList]) => {
    console.log(`${lang}: ${voiceList.map(v => v.name).join(', ')}`);
  });
};

// Speech Recognition interfaces and types
export interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  onResult?: (result: string, isFinal: boolean) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (event: any) => void;
}

// Check if speech recognition is supported by the browser
export const isSpeechRecognitionSupported = (): boolean => {
  return 'SpeechRecognition' in window || 
         'webkitSpeechRecognition' in window ||
         'mozSpeechRecognition' in window || 
         'msSpeechRecognition' in window;
};

// Speech recognition instance
let recognition: any = null;
let isRecognizing = false;

/**
 * Initialize speech recognition
 * @param options - Configuration options for speech recognition
 */
export const initSpeechRecognition = (options: SpeechRecognitionOptions = {}): void => {
  if (!isSpeechRecognitionSupported()) {
    console.error('Speech recognition is not supported in this browser');
    return;
  }

  // Get the appropriate SpeechRecognition constructor
  const SpeechRecognition = window.SpeechRecognition || 
                           (window as any).webkitSpeechRecognition ||
                           (window as any).mozSpeechRecognition || 
                           (window as any).msSpeechRecognition;

  // Create a new recognition instance
  recognition = new SpeechRecognition();
  
  // Configure recognition
  recognition.lang = options.language || 'en-US';
  recognition.continuous = options.continuous !== undefined ? options.continuous : false;
  recognition.interimResults = options.interimResults !== undefined ? options.interimResults : true;
  recognition.maxAlternatives = options.maxAlternatives || 1;

  // Set up event handlers
  recognition.onstart = () => {
    isRecognizing = true;
    if (options.onStart) options.onStart();
    console.log('Speech recognition started');
  };

  recognition.onend = () => {
    isRecognizing = false;
    if (options.onEnd) options.onEnd();
    console.log('Speech recognition ended');
  };

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    if (options.onError) options.onError(event);
  };

  recognition.onresult = (event: any) => {
    if (!options.onResult) return;
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      const isFinal = event.results[i].isFinal;
      
      options.onResult(transcript, isFinal);
      
      if (isFinal) {
        console.log('Final transcript:', transcript);
      }
    }
  };
};

/**
 * Start listening for speech input
 * @returns Promise that resolves when recognition starts
 */
export const startListening = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!recognition) {
      reject(new Error('Speech recognition not initialized. Call initSpeechRecognition first.'));
      return;
    }

    if (isRecognizing) {
      reject(new Error('Speech recognition is already running'));
      return;
    }

    try {
      recognition.start();
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Stop listening for speech input
 */
export const stopListening = (): void => {
  if (recognition && isRecognizing) {
    recognition.stop();
  }
};

/**
 * Check if speech recognition is currently active
 * @returns Boolean indicating if speech recognition is currently listening
 */
export const isListening = (): boolean => {
  return isRecognizing;
};

// Speech settings persistence
interface SpeechSettings {
  preferredVoice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  language?: string;
}

const SPEECH_SETTINGS_KEY = 'now_next_speech_settings';

/**
 * Save speech settings to localStorage
 * @param settings - The speech settings to save
 */
export const saveSpeechSettings = (settings: SpeechSettings): void => {
  try {
    localStorage.setItem(SPEECH_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving speech settings:', err);
  }
};

/**
 * Load speech settings from localStorage
 * @returns The saved speech settings, or default settings if none were saved
 */
export const loadSpeechSettings = (): SpeechSettings => {
  try {
    const settings = localStorage.getItem(SPEECH_SETTINGS_KEY);
    return settings ? JSON.parse(settings) : {};
  } catch (err) {
    console.error('Error loading speech settings:', err);
    return {};
  }
};

/**
 * Apply saved settings to a speech options object
 * @param options - Current speech options
 * @returns Speech options with saved settings applied
 */
export const applyStoredSpeechSettings = (options: SpeechOptions = {}): SpeechOptions => {
  const storedSettings = loadSpeechSettings();
  
  return {
    ...options,
    voiceName: options.voiceName || storedSettings.preferredVoice,
    rate: options.rate !== undefined ? options.rate : storedSettings.rate,
    pitch: options.pitch !== undefined ? options.pitch : storedSettings.pitch,
    volume: options.volume !== undefined ? options.volume : storedSettings.volume,
    lang: options.lang || storedSettings.language
  };
};