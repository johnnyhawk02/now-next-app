import { useState, useEffect } from 'react';
import ActivityCard from './components/ActivityCard.tsx';
import SymbolSelectionPopup from './components/SymbolSelectionPopup.tsx';
import BurgerMenu from './components/BurgerMenu.tsx';
import styles from './App.module.css';

const AVAILABLE_SYMBOLS = [
  'bath.png',
  'brush teeth girl.png',
  'bunk beds.png',
  'dream machine.png',
];

const App = () => {
  const [nowSymbol, setNowSymbol] = useState<string | null>(null);
  const [nextSymbol, setNextSymbol] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<'now' | 'next' | 'sequence' | null>(null);
  const [sequence, setSequence] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handler for symbol selection
  const handleSelectSymbol = (e: React.MouseEvent, symbolName: string) => {
    e.stopPropagation();
    
    console.log(`Symbol selected: ${symbolName}`);
    console.log(`Popup type: ${isPopupOpen}`);

    if (isPopupOpen === 'now') {
      setNowSymbol(symbolName);
      setIsPopupOpen(null);
    } else if (isPopupOpen === 'next') {
      setNextSymbol(symbolName);
      setIsPopupOpen(null);
    } else if (isPopupOpen === 'sequence') {
      setSequence(prev => [...prev, symbolName]);
    }
  };

  // Handler for the "Finish Now" action
  const handleFinishNow = () => {
    if (!nextSymbol) {
      alert("Please select the 'Next' activity first.");
      return;
    }
    setNowSymbol(nextSymbol);
    setNextSymbol(null);
    setIsMenuOpen(false);
  };

  // Handler for feeding from the sequence
  const handleFeedSequence = () => {
    if (sequence.length > 0) {
      setNowSymbol(sequence[0]);
      setNextSymbol(sequence.length > 1 ? sequence[1] : null);
      setSequence(sequence.slice(sequence.length > 1 ? 2 : 1));
    } else {
      alert("The sequence is empty. Please create a sequence first.");
    }
    setIsMenuOpen(false);
  };

  // Handler for opening popups
  const openPopup = (type: 'now' | 'next' | 'sequence') => {
    setIsPopupOpen(type);
    setIsMenuOpen(false);
  };

  // Initialize with default symbols if needed
  useEffect(() => {
    if (!nextSymbol && !nowSymbol) {
      setNextSymbol(AVAILABLE_SYMBOLS[0]);
    }
  }, [nowSymbol, nextSymbol]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Activity Planner</h1>
      <div className={styles.grid}>
        <ActivityCard 
          title="Now" 
          symbolFilename={nowSymbol} 
          onClick={() => openPopup('now')} 
        />
        <ActivityCard 
          title="Next" 
          symbolFilename={nextSymbol} 
          onClick={() => openPopup('next')} 
        />
      </div>

      {/* Burger Menu Button */}
      <button onClick={() => setIsMenuOpen(true)} className={styles.burgerButton}>
        ☰
      </button>

      {/* Burger Menu Component */}
      <BurgerMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectOption={openPopup}
        onFinishNow={handleFinishNow}
        onFeedSequence={handleFeedSequence}
      />

      {/* Symbol Selection Popup Component */}
      <SymbolSelectionPopup 
        isOpen={isPopupOpen !== null}
        popupType={isPopupOpen}
        onClose={() => setIsPopupOpen(null)}
        onSelectSymbol={handleSelectSymbol}
        availableSymbols={AVAILABLE_SYMBOLS}
        sequenceLength={sequence.length}
      />
    </div>
  );
};

export default App;