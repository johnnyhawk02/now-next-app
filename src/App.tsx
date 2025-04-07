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
  getSymbolById,
  SYMBOLS
} from './data/symbols';
import {
  getAllSequences,
  Sequence,
  SEQUENCES
} from './data/sequences';
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
  
  // Sequence editor state
  const [isSequenceEditorOpen, setIsSequenceEditorOpen] = useState(false);
  const [sequenceToEdit, setSequenceToEdit] = useState<Sequence | undefined>(undefined);

  const handleSelectSymbol = (e: React.MouseEvent, symbolName: string) => {
    e.stopPropagation();

    if (isPopupOpen === 'now') {
      setNowSymbol(symbolName);
      setIsPopupOpen(null);
      
      // Update the selected sequence if we have one
      if (selectedSequenceId) {
        updateSelectedSequence(symbolName, null);
      }
    } else if (isPopupOpen === 'next') {
      setNextSymbol(symbolName);
      setIsPopupOpen(null);
      
      // Update the selected sequence if we have one
      if (selectedSequenceId) {
        updateSelectedSequence(null, symbolName);
      }
    }
  };

  // Updates the currently selected sequence with new symbols
  const updateSelectedSequence = (nowSymbolName: string | null, nextSymbolName: string | null) => {
    if (!selectedSequenceId) return;
    
    const allSequences = [...SEQUENCES, ...userSequences];
    const sequence = allSequences.find(seq => seq.id === selectedSequenceId);
    if (!sequence) return;
    
    // Find symbol IDs from the filenames
    const findSymbolIdByFilename = (filename: string | null) => {
      if (!filename) return null;
      const symbols = SYMBOLS.filter(s => s.filename === filename);
      return symbols.length > 0 ? symbols[0].id : null;
    };
    
    // Check if this is a user-created sequence or a preset
    const sequenceIndex = sequences.findIndex(seq => seq.id === selectedSequenceId);
    const isUserCreated = userCreatedSequences[sequenceIndex];
    
    if (isUserCreated) {
      // For user-created sequence: Update the existing sequence
      const updatedSequence = { ...sequence };
      
      // Update the symbol IDs at the current step and next step
      if (nowSymbolName) {
        const nowSymbolId = findSymbolIdByFilename(nowSymbolName);
        if (nowSymbolId) {
          updatedSequence.symbolIds[currentStepIndex] = nowSymbolId;
        }
      }
      
      if (nextSymbolName && currentStepIndex + 1 < sequence.symbolIds.length) {
        const nextSymbolId = findSymbolIdByFilename(nextSymbolName);
        if (nextSymbolId) {
          updatedSequence.symbolIds[currentStepIndex + 1] = nextSymbolId;
        }
      }
      
      // Update the user sequences
      const userSequenceIndex = userSequences.findIndex(seq => seq.id === selectedSequenceId);
      if (userSequenceIndex >= 0) {
        const updatedUserSequences = [...userSequences];
        updatedUserSequences[userSequenceIndex] = updatedSequence;
        setUserSequences(updatedUserSequences);
      }
    } else {
      // For preset sequence: Create a new user sequence based on the preset
      createUserSequenceFromPreset(sequence, nowSymbolName, nextSymbolName);
    }
  };

  // Create a new user sequence based on a preset sequence
  const createUserSequenceFromPreset = (
    presetSequence: Sequence,
    nowSymbolName: string | null,
    nextSymbolName: string | null
  ) => {
    // Create a copy of the preset sequence
    const newSequence: Sequence = {
      ...presetSequence,
      id: generateUniqueSequenceId(presetSequence.name),
      name: generateUniqueSequenceName(presetSequence.name),
    };

    // Apply the symbol changes if provided
    if (nowSymbolName) {
      const nowSymbolId = SYMBOLS.find(s => s.filename === nowSymbolName)?.id;
      if (nowSymbolId) {
        newSequence.symbolIds[currentStepIndex] = nowSymbolId;
      }
    }
    
    if (nextSymbolName && currentStepIndex + 1 < presetSequence.symbolIds.length) {
      const nextSymbolId = SYMBOLS.find(s => s.filename === nextSymbolName)?.id;
      if (nextSymbolId) {
        newSequence.symbolIds[currentStepIndex + 1] = nextSymbolId;
      }
    }

    // Add to user sequences
    setUserSequences(prev => [...prev, newSequence]);
    
    // Select the new sequence
    setSelectedSequenceId(newSequence.id);
  };

  // Generate a unique name for a sequence like "PresetName_001"
  const generateUniqueSequenceName = (baseName: string): string => {
    let counter = 1;
    let newName = `${baseName}_001`;
    
    // Keep incrementing the counter until we find a unique name
    while (userSequences.some(seq => seq.name === newName)) {
      counter++;
      newName = `${baseName}_${counter.toString().padStart(3, '0')}`;
    }
    
    return newName;
  };

  // Generate a unique ID for a sequence based on its name
  const generateUniqueSequenceId = (baseName: string): string => {
    // Create a base ID by lowercasing and replacing spaces with hyphens
    const baseId = `${baseName.toLowerCase().replace(/\s+/g, '-')}-copy`;
    
    let counter = 1;
    let newId = `${baseId}-${counter.toString().padStart(3, '0')}`;
    
    // Keep incrementing the counter until we find a unique ID
    while ([...SEQUENCES, ...userSequences].some(seq => seq.id === newId)) {
      counter++;
      newId = `${baseId}-${counter.toString().padStart(3, '0')}`;
    }
    
    return newId;
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