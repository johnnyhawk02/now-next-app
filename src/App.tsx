import { useState, useEffect } from 'react';
import ActivityCard from './components/ActivityCard.tsx';
import SymbolSelectionPopup from './components/SymbolSelectionPopup.tsx';
import styles from './App.module.css';

const AVAILABLE_SYMBOLS = [
  'bath.png',
  'bedtime song bunk beds.png',
  'bedtime song.png',
  'brush hair.png',
  'brush teeth girl.png',
  'bunk beds.png',
  'dream machine.png',
  'easter egg.png',
  'finished.png',
  'get dressed for school.png',
  'get dressed.png',
  'ice lolly.png',
  'ipad.png',
  'pyjamas.png',
  'sleep in bunk beds.png',
  'sleep.png',
  'toilet.png'
];

const App = () => {
  const [nowSymbol, setNowSymbol] = useState<string | null>(null);
  const [nextSymbol, setNextSymbol] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<'now' | 'next' | null>(null); // Removed 'sequence' type

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
    }
  };

  // Handler for opening popups - removed 'sequence' type
  const openPopup = (type: 'now' | 'next') => {
    setIsPopupOpen(type);
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
          isFocus={true}
        />
        <ActivityCard
          title="Next"
          symbolFilename={nextSymbol}
          onClick={() => openPopup('next')}
        />
      </div>

      {/* Symbol Selection Popup Component - removed sequence props */}
      <SymbolSelectionPopup
        isOpen={isPopupOpen !== null}
        popupType={isPopupOpen}
        onClose={() => setIsPopupOpen(null)}
        onSelectSymbol={handleSelectSymbol}
        availableSymbols={AVAILABLE_SYMBOLS}
      />
    </div>
  );
};

export default App;