import { useState, useEffect } from 'react';
import ActivityCard from './components/ActivityCard.tsx';
import SymbolSelectionPopup from './components/SymbolSelectionPopup.tsx';
import { 
  SYMBOLS,
  CATEGORIES, 
  getAllCategories, 
  getSymbolsByCategory, 
  getAllFilenames,
  getSymbolByFilename
} from './data/symbols';
import styles from './App.module.css';

const App = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [nowSymbol, setNowSymbol] = useState<string | null>(null);
  const [nextSymbol, setNextSymbol] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<'now' | 'next' | null>(null);
  const [favoriteSymbols, setFavoriteSymbols] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | 'Favorites'>('Favorites');

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

  // Get the symbols to display based on active category
  const getDisplaySymbols = (): string[] => {
    if (activeCategory === 'Favorites') {
      return favoriteSymbols.length > 0 ? favoriteSymbols : getAllFilenames();
    }
    return getSymbolsByCategory(activeCategory).map(symbol => symbol.filename);
  };

  // Effect to initialize with default symbols if needed
  useEffect(() => {
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
  }, [nowSymbol, nextSymbol]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteSymbols', JSON.stringify(favoriteSymbols));
  }, [favoriteSymbols]);

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