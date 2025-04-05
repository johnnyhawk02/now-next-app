import { useState, useEffect } from 'react';
import ActivityCard from './components/ActivityCard.tsx';
import SymbolSelectionPopup from './components/SymbolSelectionPopup.tsx';
import styles from './App.module.css';

const AVAILABLE_SYMBOLS = [
  'bath.png',
  'bedtime song bunk beds.png',
  'bedtime song.png',
  'bottle.png',
  'brush hair.png',
  'brush teeth girl.png',
  'bunk beds.png',
  'car.png',
  'cheese on toast.png',
  'Chloe.png',
  'dinner time.png',
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

// Restored isEditMode state and toggle functionality, but removed the text
const App = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [nowSymbol, setNowSymbol] = useState<string | null>(null);
  const [nextSymbol, setNextSymbol] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<'now' | 'next' | null>(null);

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

  useEffect(() => {
    if (!nextSymbol && !nowSymbol) {
      setNextSymbol(AVAILABLE_SYMBOLS[0]);
    }
  }, [nowSymbol, nextSymbol]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Activity Planner</h1>

      <label className={styles.editModeToggleLabel}>
        <input
          type="checkbox"
          className={styles.editModeToggle}
          checked={isEditMode}
          onChange={() => setIsEditMode(!isEditMode)}
        />
        <span className={styles.toggleSlider}></span>
      </label>

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