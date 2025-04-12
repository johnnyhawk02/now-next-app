import { useState, useEffect } from 'react';
import ActivityCard from './components/ActivityCard.tsx';
import SymbolSelectionPopup from './components/SymbolSelectionPopup.tsx';
import AppBar from './components/AppBar.tsx';
import { 
  getAllTags,
  getSymbolsByTag,
  getAllFilenames,
  SYMBOLS,
  getSymbolByFilename
} from './data/symbols';
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
  const [activeTag, setActiveTag] = useState<string | 'Favorites' | 'All'>('All');
  
  const handleSelectSymbol = (e: React.MouseEvent, symbolName: string) => {
    e.stopPropagation();

    if (isPopupOpen === 'next') {
      setCurrentSymbol(symbolName);
      setIsPopupOpen(null);
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

  const getDisplaySymbols = (): string[] => {
    if (activeTag === 'Favorites') {
      return favoriteSymbols.length > 0 ? favoriteSymbols : getAllFilenames();
    } else if (activeTag === 'All') {
      return getAllFilenames();
    }
    return getSymbolsByTag(activeTag).map(symbol => symbol.filename);
  };

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteSymbols');
    if (storedFavorites) {
      setFavoriteSymbols(JSON.parse(storedFavorites));
    }
    
    if (!currentSymbol) {
      setCurrentSymbol('get_dressed.png');
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('favoriteSymbols', JSON.stringify(favoriteSymbols));
  }, [favoriteSymbols]);
  
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
  }, []);

  const currentSymbolObject = currentSymbol ? getSymbolByFilename(currentSymbol) : null;
  const cardTitle = currentSymbolObject ? currentSymbolObject.displayName : "Select Symbol";

  return (
    <div className={styles.container}>
      <AppBar 
        title="Up Next"
      />
      
      <div className={styles.content}>
        <div className={styles.activityCardContainer}>
          <ActivityCard
            title={cardTitle}
            symbolFilename={currentSymbol}
            onClick={() => openPopup('next')}
            isEditMode={isEditMode}
            onEditModeToggle={handleEditModeToggle}
          />
        </div>
      </div>
      
      <SymbolSelectionPopup
        isOpen={isPopupOpen === 'next'}
        popupType="next"
        onClose={() => setIsPopupOpen(null)}
        onSelectSymbol={handleSelectSymbol}
        availableSymbols={getDisplaySymbols()}
        tags={['All', 'Favorites', ...getAllTags()]}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
        favoriteSymbols={favoriteSymbols}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default App;