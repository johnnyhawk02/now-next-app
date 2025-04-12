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
  SYMBOLS,
  getSymbolByFilename
} from './data/symbols';
import {
  Sequence,
  SEQUENCES
} from './data/sequences';
import styles from './App.module.css';

// Helper function to format display name for audio filename
const formatDisplayNameForAudio = (displayName: string): string => {
  return displayName
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s_]/g, '') // Remove punctuation except underscore
    .trim() // Trim leading/trailing whitespace
    .replace(/\s+/g, '_'); // Replace spaces with underscores
};

const App = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<'next' | null>(null);
  const [favoriteSymbols, setFavoriteSymbols] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | 'Favorites'>('Favorites');
  
  // Sequence state
  const [userSequences, setUserSequences] = useState<Sequence[]>([]);
  const [selectedSequenceId, setSelectedSequenceId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  
  // Sequence editor state
  const [isSequenceEditorOpen, setIsSequenceEditorOpen] = useState(false);
  const [sequenceToEdit, setSequenceToEdit] = useState<Sequence | undefined>(undefined);

  const handleSelectSymbol = (e: React.MouseEvent, symbolName: string) => {
    e.stopPropagation();

    if (isPopupOpen === 'next') {
      setCurrentSymbol(symbolName);
      setIsPopupOpen(null);
      
      if (selectedSequenceId) {
        setSelectedSequenceId(null);
        setCurrentStepIndex(-1);
      }
    }
  };

  const openPopup = (type: 'next') => {
    if (isEditMode) {
        setIsPopupOpen(type);
    }
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
      setCurrentStepIndex(-1);
      setCurrentSymbol(null);
      return;
    }
    
    // Use combinedSequences to find the sequence (default or user)
    const sequence = combinedSequences.find(seq => seq.id === sequenceId);
    if (sequence && sequence.symbolIds.length > 0) {
      setSelectedSequenceId(sequenceId);
      setCurrentStepIndex(-1);

      const firstSymbolId = sequence.symbolIds[0];
      const firstSymbolObj = getSymbolById(firstSymbolId);
      if (firstSymbolObj) {
        setCurrentSymbol(firstSymbolObj.filename);
      } else {
        setCurrentSymbol(null);
      }
    } else {
        setSelectedSequenceId(null);
        setCurrentStepIndex(-1);
        setCurrentSymbol(null);
    }
  };
  
  const handlePrevStep = () => {
    if (!selectedSequenceId || currentStepIndex < 0) return;
    
    setCurrentStepIndex(prevIndex => {
      const newIndex = prevIndex - 1;
      updateSymbolForStep(newIndex);
      return newIndex;
    });
  };
  
  const handleNextStep = () => {
    if (!selectedSequenceId) return;
    
    // Use combinedSequences here as well
    const sequence = combinedSequences.find(seq => seq.id === selectedSequenceId);
    if (!sequence || currentStepIndex >= sequence.symbolIds.length - 1) return;
    
    setCurrentStepIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      updateSymbolForStep(newIndex);
      return newIndex;
    });
  };
  
  const updateSymbolForStep = (stepIndex: number) => {
    // And use combinedSequences here too
    const sequence = combinedSequences.find(seq => seq.id === selectedSequenceId);
    if (sequence) {
      const nextStepSymbolIndex = stepIndex + 1;
      if (nextStepSymbolIndex >= 0 && nextStepSymbolIndex < sequence.symbolIds.length) {
        const symbolId = sequence.symbolIds[nextStepSymbolIndex];
        const symbolObj = getSymbolById(symbolId);
        setCurrentSymbol(symbolObj ? symbolObj.filename : null);
      } else {
        setCurrentSymbol(null);
      }
    } else {
        setCurrentSymbol(null);
    }
  };
  
  const handleCreateSequence = () => {
    setSequenceToEdit(undefined);
    setIsSequenceEditorOpen(true);
  };
  
  const handleEditSequence = (sequence: Sequence) => {
    setSequenceToEdit(sequence);
    setIsSequenceEditorOpen(true);
  };
  
  const handleDeleteSequence = (sequenceId: string) => {
    const updatedUserSequences = userSequences.filter(sequence => sequence.id !== sequenceId);
    setUserSequences(updatedUserSequences);
    
    if (selectedSequenceId === sequenceId) {
      setSelectedSequenceId(null);
    }
  };
  
  const handleSaveSequence = (sequence: Sequence) => {
    const filteredSymbols = sequence.symbolIds.filter(id => id !== 'finished');
    const updatedSequence = {
      ...sequence,
      symbolIds: [...filteredSymbols, 'finished'],
    };

    const existingIndex = userSequences.findIndex(seq => seq.id === sequence.id);
    if (existingIndex >= 0) {
      const updatedSequences = [...userSequences];
      updatedSequences[existingIndex] = updatedSequence;
      setUserSequences(updatedSequences);
    } else {
      setUserSequences(prev => [...prev, updatedSequence]);
    }

    setSelectedSequenceId(updatedSequence.id);
    setCurrentStepIndex(-1);
  };

  const getDisplaySymbols = (): string[] => {
    if (activeCategory === 'Favorites') {
      return favoriteSymbols.length > 0 ? favoriteSymbols : getAllFilenames();
    }
    return getSymbolsByCategory(activeCategory).map(symbol => symbol.filename);
  };

  useEffect(() => {
    const storedUserSequences = localStorage.getItem('userSequences');
    const initialUserSequences = storedUserSequences ? JSON.parse(storedUserSequences) : [];
    setUserSequences(initialUserSequences);

    if (!currentSymbol && !selectedSequenceId) {
      setCurrentSymbol('get_dressed.png');
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('favoriteSymbols', JSON.stringify(favoriteSymbols));
  }, [favoriteSymbols]);
  
  useEffect(() => {
    localStorage.setItem('userSequences', JSON.stringify(userSequences));
  }, [userSequences]);
  
  const combinedSequences = [...SEQUENCES, ...userSequences];
  const userCreatedSequences = [
    ...Array(SEQUENCES.length).fill(false),
    ...Array(userSequences.length).fill(true)
  ];

  // Preload audio files
  useEffect(() => {
    console.log('Preloading audio files...');
    let preloadedCount = 0;
    let failedCount = 0;

    SYMBOLS.forEach(symbol => {
      const filenameBase = formatDisplayNameForAudio(symbol.displayName);
      if (filenameBase) {
        const audioPath = `/audio/${filenameBase}.mp3`;
        fetch(audioPath)
          .then(response => {
            if (response.ok) {
              preloadedCount++;
            } else {
              // Don't throw an error, just log it
              console.warn(`Failed to preload audio: ${audioPath} (Status: ${response.status})`);
              failedCount++;
            }
          })
          .catch(error => {
            console.warn(`Failed to preload audio: ${audioPath}`, error);
            failedCount++;
          })
          .finally(() => {
            // Optional: Log progress or completion
            if (preloadedCount + failedCount === SYMBOLS.length) {
                console.log(`Audio preloading complete. Success: ${preloadedCount}, Failed: ${failedCount}`);
            }
          });
      } else {
          console.warn(`Could not generate audio filename for symbol: ${symbol.displayName}`);
          failedCount++;
      }
    });
  }, []); // Run only once on mount

  // Determine the title for the activity card
  const currentSymbolObject = currentSymbol ? getSymbolByFilename(currentSymbol) : null;
  const cardTitle = currentSymbolObject ? currentSymbolObject.displayName : "Select Symbol";

  return (
    <div className={styles.container}>
      <AppBar 
        title="Next Up"
        onEditModeToggle={handleEditModeToggle}
        isEditMode={isEditMode}
      />
      
      <div className={styles.content}>
        <div className={styles.activityCardContainer}>
          <ActivityCard
            title={cardTitle}
            symbolFilename={currentSymbol}
            onClick={() => openPopup('next')}
            isEditMode={isEditMode}
          />
        </div>
      </div>
      
      <SequenceBar
        sequences={combinedSequences}
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
        onClose={() => {
            setIsSequenceEditorOpen(false);
            setSequenceToEdit(undefined);
        }}
        onSaveSequence={handleSaveSequence}
        initialSequence={sequenceToEdit}
        allSequences={combinedSequences}
      />

      <SymbolSelectionPopup
        isOpen={isPopupOpen === 'next'}
        popupType="next"
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