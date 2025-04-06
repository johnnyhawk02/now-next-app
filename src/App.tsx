import { useState, useEffect } from 'react';
import ActivityCard from './components/ActivityCard.tsx';
import SymbolSelectionPopup from './components/SymbolSelectionPopup.tsx';
import AppBar from './components/AppBar.tsx';
import SequenceBar from './components/SequenceBar.tsx';
import SequenceEditor from './components/SequenceEditor.tsx';
import { 
  getAllCategories, 
  getSymbolsByCategory, 
  getAllFilenames,
  getSymbolById
} from './data/symbols';
import {
  getAllSequences,
  Sequence,
  SEQUENCES
} from './data/sequences';
import { speakWithSiri } from './utils/speech';
import styles from './App.module.css';

const App = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [nowSymbol, setNowSymbol] = useState<string | null>(null);
  const [nextSymbol, setNextSymbol] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<'now' | 'next' | null>(null);
  const [favoriteSymbols, setFavoriteSymbols] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | 'Favorites'>('Favorites');
  
  // Sequence state
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [userSequences, setUserSequences] = useState<Sequence[]>([]);
  const [userCreatedSequences, setUserCreatedSequences] = useState<boolean[]>([]);
  const [selectedSequenceId, setSelectedSequenceId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [autoAnnounce, setAutoAnnounce] = useState(true);
  
  // Sequence editor state
  const [isSequenceEditorOpen, setIsSequenceEditorOpen] = useState(false);
  const [sequenceToEdit, setSequenceToEdit] = useState<Sequence | undefined>(undefined);

  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);

  const handleVoiceChange = (voiceURI: string) => {
    setSelectedVoiceURI(voiceURI);
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoiceURI) {
      const voice = window.speechSynthesis.getVoices().find(v => v.voiceURI === selectedVoiceURI);
      if (voice) {
        utterance.voice = voice;
      }
    }
    window.speechSynthesis.speak(utterance);
  };

  // Speak activity name automatically when it changes
  useEffect(() => {
    if (autoAnnounce && nowSymbol && !isEditMode && !isPopupOpen && !isSequenceEditorOpen) {
      const symbol = getSymbolById(nowSymbol.replace('.png', ''));
      const textToSpeak = symbol?.displayName || nowSymbol.split('.')[0].replace(/([A-Z])/g, ' $1').trim();
      
      // Add a small delay before speaking to ensure UI has updated
      const timer = setTimeout(() => {
        speakWithSiri(textToSpeak, { cancelExisting: true });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [nowSymbol, isEditMode, isPopupOpen, isSequenceEditorOpen, autoAnnounce]);

  const handleSelectSymbol = (e: React.MouseEvent, symbolName: string) => {
    e.stopPropagation();

    if (isPopupOpen === 'now') {
      setNowSymbol(symbolName);
      setIsPopupOpen(null);
    } else if (isPopupOpen === 'next') {
      setNextSymbol(symbolName);
      setIsPopupOpen(null);
    }
  };

  const openPopup = (type: 'now' | 'next') => {
    setIsPopupOpen(type);
  };

  const toggleFavorite = (symbolName: string) => {
    setFavoriteSymbols(prevFavorites => 
      prevFavorites.includes(symbolName)
        ? prevFavorites.filter(name => name !== symbolName)
        : [...prevFavorites, symbolName]
    );
  };

  const handleEditModeToggle = () => {
    setIsEditMode(!isEditMode);
  };
  
  // Toggle auto-announce feature
  const toggleAutoAnnounce = () => {
    setAutoAnnounce(prev => !prev);
  };

  const handleSelectSequence = (sequenceId: string) => {
    if (sequenceId === '') {
      setSelectedSequenceId(null);
      return;
    }
    
    setSelectedSequenceId(sequenceId);
    setCurrentStepIndex(0);
    
    // Update Now and Next with the first two steps in the sequence
    const sequence = [...SEQUENCES, ...userSequences].find(seq => seq.id === sequenceId);
    if (sequence && sequence.symbolIds.length > 0) {
      // Set "Now" to first step
      const nowSymbolId = sequence.symbolIds[0];
      const nowSymbolObj = getSymbolById(nowSymbolId);
      if (nowSymbolObj) {
        setNowSymbol(nowSymbolObj.filename);
      }
      
      // Set "Next" to second step if available
      if (sequence.symbolIds.length > 1) {
        const nextSymbolId = sequence.symbolIds[1];
        const nextSymbolObj = getSymbolById(nextSymbolId);
        if (nextSymbolObj) {
          setNextSymbol(nextSymbolObj.filename);
        }
      }
    }
  };
  
  const handlePrevStep = () => {
    if (currentStepIndex <= 0) return;
    
    setCurrentStepIndex(prevIndex => {
      const newIndex = prevIndex - 1;
      updateSymbolsForStep(newIndex);
      return newIndex;
    });
  };
  
  const handleNextStep = () => {
    if (!selectedSequenceId) return;
    
    const allSequences = [...SEQUENCES, ...userSequences];
    const sequence = allSequences.find(seq => seq.id === selectedSequenceId);
    if (!sequence || currentStepIndex >= sequence.symbolIds.length - 1) return;
    
    setCurrentStepIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      updateSymbolsForStep(newIndex);
      return newIndex;
    });
  };
  
  // Update Now and Next based on current step in the sequence
  const updateSymbolsForStep = (stepIndex: number) => {
    if (!selectedSequenceId) return;
    
    const allSequences = [...SEQUENCES, ...userSequences];
    const sequence = allSequences.find(seq => seq.id === selectedSequenceId);
    if (!sequence) return;
    
    // Set "Now" to current step
    if (stepIndex >= 0 && stepIndex < sequence.symbolIds.length) {
      const nowSymbolId = sequence.symbolIds[stepIndex];
      const nowSymbolObj = getSymbolById(nowSymbolId);
      if (nowSymbolObj) {
        setNowSymbol(nowSymbolObj.filename);
      }
    }
    
    // Set "Next" to next step if available
    if (stepIndex + 1 < sequence.symbolIds.length) {
      const nextSymbolId = sequence.symbolIds[stepIndex + 1];
      const nextSymbolObj = getSymbolById(nextSymbolId);
      if (nextSymbolObj) {
        setNextSymbol(nextSymbolObj.filename);
      }
    } else {
      // Clear next if we're on the last step
      setNextSymbol(null);
    }
  };
  
  // Custom sequence management
  const handleCreateSequence = () => {
    setSequenceToEdit(undefined);  // No initial sequence for creation
    setIsSequenceEditorOpen(true);
  };
  
  const handleEditSequence = (sequence: Sequence) => {
    setSequenceToEdit(sequence);
    setIsSequenceEditorOpen(true);
  };
  
  const handleDeleteSequence = (sequenceId: string) => {
    const updatedUserSequences = userSequences.filter(sequence => sequence.id !== sequenceId);
    setUserSequences(updatedUserSequences);
    
    // If the deleted sequence is currently selected, clear the selection
    if (selectedSequenceId === sequenceId) {
      setSelectedSequenceId(null);
    }
  };
  
  const handleSaveSequence = (sequence: Sequence) => {
    // Check if we're updating an existing sequence
    const existingIndex = userSequences.findIndex(seq => seq.id === sequence.id);
    
    if (existingIndex >= 0) {
      // Update existing sequence
      const updatedSequences = [...userSequences];
      updatedSequences[existingIndex] = sequence;
      setUserSequences(updatedSequences);
    } else {
      // Add new sequence
      setUserSequences(prev => [...prev, sequence]);
    }
    
    // Select the saved sequence
    setSelectedSequenceId(sequence.id);
    setCurrentStepIndex(0);
  };

  // Get the symbols to display based on active category
  const getDisplaySymbols = (): string[] => {
    if (activeCategory === 'Favorites') {
      return favoriteSymbols.length > 0 ? favoriteSymbols : getAllFilenames();
    }
    return getSymbolsByCategory(activeCategory).map(symbol => symbol.filename);
  };

  // Load initial data and user sequences
  useEffect(() => {
    // Load default sequences
    const defaultSequences = getAllSequences();
    
    // Load user sequences from localStorage
    let loadedUserSequences: Sequence[] = [];
    const savedUserSequences = localStorage.getItem('userSequences');
    if (savedUserSequences) {
      try {
        loadedUserSequences = JSON.parse(savedUserSequences);
      } catch (e) {
        console.error('Failed to load user sequences', e);
      }
    }
    
    // Combine sequences
    const allSequences = [...defaultSequences, ...loadedUserSequences];
    setSequences(allSequences);
    setUserSequences(loadedUserSequences);
    
    // Set which sequences are user-created
    const userCreatedFlags = allSequences.map((_, idx) => idx >= defaultSequences.length);
    setUserCreatedSequences(userCreatedFlags);
    
    // Initialize with default symbols if needed
    const allFilenames = getAllFilenames();
    if (!nextSymbol && !nowSymbol && allFilenames.length > 0) {
      setNextSymbol(allFilenames[0]);
    }
    
    // Load favorites from localStorage if available
    const savedFavorites = localStorage.getItem('favoriteSymbols');
    if (savedFavorites) {
      try {
        setFavoriteSymbols(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Failed to load favorites from localStorage', e);
      }
    }
    
    // Load last selected sequence if available
    const savedSequenceId = localStorage.getItem('selectedSequenceId');
    if (savedSequenceId) {
      try {
        const sequenceId = JSON.parse(savedSequenceId);
        const sequenceExists = allSequences.some(seq => seq.id === sequenceId);
        
        if (sequenceExists) {
          setSelectedSequenceId(sequenceId);
          
          // Also load the last step index if available
          const savedStepIndex = localStorage.getItem('currentStepIndex');
          if (savedStepIndex) {
            const stepIndex = JSON.parse(savedStepIndex);
            setCurrentStepIndex(stepIndex);
          }
        }
      } catch (e) {
        console.error('Failed to load saved sequence', e);
      }
    }
  }, []);
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteSymbols', JSON.stringify(favoriteSymbols));
  }, [favoriteSymbols]);
  
  // Save user sequences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userSequences', JSON.stringify(userSequences));
    
    // Update the combined sequences and user created flags
    const allSequences = [...SEQUENCES, ...userSequences];
    setSequences(allSequences);
    
    const userCreatedFlags = allSequences.map((_, idx) => idx >= SEQUENCES.length);
    setUserCreatedSequences(userCreatedFlags);
  }, [userSequences]);
  
  // Save selected sequence and step index to localStorage
  useEffect(() => {
    if (selectedSequenceId) {
      localStorage.setItem('selectedSequenceId', JSON.stringify(selectedSequenceId));
      localStorage.setItem('currentStepIndex', JSON.stringify(currentStepIndex));
    } else {
      localStorage.removeItem('selectedSequenceId');
      localStorage.removeItem('currentStepIndex');
    }
  }, [selectedSequenceId, currentStepIndex]);
  
  // Whenever the sequence or step changes, update the symbols
  useEffect(() => {
    if (selectedSequenceId) {
      updateSymbolsForStep(currentStepIndex);
    }
  }, [selectedSequenceId, currentStepIndex]);

  return (
    <div className={styles.container}>
      <AppBar 
        title="Activity Planner" 
        onEditModeToggle={handleEditModeToggle}
        isEditMode={isEditMode}
        autoAnnounce={autoAnnounce}
        onToggleAutoAnnounce={toggleAutoAnnounce}
        onVoiceChange={handleVoiceChange}
      />
      
      <div className={styles.content}>
        <div className={styles.grid}>
          <ActivityCard
            title="Now"
            symbolFilename={nowSymbol}
            onClick={() => openPopup('now')}
            isFocus={true}
            isEditMode={isEditMode}
          />
          <ActivityCard
            title="Next"
            symbolFilename={nextSymbol}
            onClick={() => openPopup('next')}
            isEditMode={isEditMode}
          />
        </div>
      </div>
      
      <SequenceBar
        sequences={sequences}
        selectedSequenceId={selectedSequenceId}
        currentStepIndex={currentStepIndex}
        onSelectSequence={handleSelectSequence}
        onPrevStep={handlePrevStep}
        onNextStep={handleNextStep}
        onCreateSequence={handleCreateSequence}
        onEditSequence={handleEditSequence}
        onDeleteSequence={handleDeleteSequence}
        userCreatedSequences={userCreatedSequences}
        isEditMode={isEditMode}
      />
      
      <SequenceEditor
        isOpen={isSequenceEditorOpen}
        onClose={() => setIsSequenceEditorOpen(false)}
        onSaveSequence={handleSaveSequence}
        initialSequence={sequenceToEdit}
        allSequences={sequences}
      />

      <SymbolSelectionPopup
        isOpen={isPopupOpen !== null}
        popupType={isPopupOpen}
        onClose={() => setIsPopupOpen(null)}
        onSelectSymbol={handleSelectSymbol}
        availableSymbols={getDisplaySymbols()}
        categories={getAllCategories()}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        favoriteSymbols={favoriteSymbols}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default App;