import React from 'react';
import SymbolButton from './SymbolButton';
import styles from './SymbolSelectionPopup.module.css';

interface SymbolSelectionPopupProps {
  isOpen: boolean;
  popupType: 'next' | 'sequence' | null;
  title?: string;
  onClose: () => void;
  onSelectSymbol: (e: React.MouseEvent, symbolName: string) => void;
  availableSymbols: string[];
  sequenceLength?: number;
  categories?: string[];
  activeCategory?: string | 'Favorites';
  setActiveCategory?: (category: string | 'Favorites') => void;
  favoriteSymbols?: string[];
  toggleFavorite?: (symbolName: string) => void;
}

const SymbolSelectionPopup: React.FC<SymbolSelectionPopupProps> = ({
  isOpen,
  popupType,
  onClose,
  onSelectSymbol,
  availableSymbols,
  sequenceLength = 0,
  categories = [],
  activeCategory = 'Favorites',
  setActiveCategory,
  favoriteSymbols = [],
  toggleFavorite
}) => {
  if (!isOpen) return null;
  
  // Determine the title based on popupType
  let dynamicTitle = 'Select Symbol'; // Default title
  if (popupType === 'next') {
      dynamicTitle = 'Select Next Symbol';
  } else if (popupType === 'sequence') {
      dynamicTitle = 'Add Symbol to Sequence'; // Updated title for sequence mode
  }

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        {/* Fixed header with title and category tabs */}
        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <h2 className={styles.popupTitle}>
              {dynamicTitle} {/* Use dynamic title */} 
              {popupType === 'sequence' && (
                <div className={styles.sequenceInfo}>
                  Selected: {sequenceLength} symbols
                </div>
              )}
            </h2>
            <button className={styles.closeX} onClick={onClose}>✕</button>
          </div>
          
          {/* Categories tabs */}
          {categories.length > 0 && (
            <div className={styles.categoryTabs}>
              <button 
                className={`${styles.categoryTab} ${activeCategory === 'Favorites' ? styles.activeTab : ''}`}
                onClick={() => setActiveCategory && setActiveCategory('Favorites')}
              >
                ⭐ Favorites
              </button>
              {categories.map(category => (
                <button 
                  key={category}
                  className={`${styles.categoryTab} ${activeCategory === category ? styles.activeTab : ''}`}
                  onClick={() => setActiveCategory && setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Scrollable content */}
        <div className={styles.scrollContent}>
          <div className={styles.symbolGrid}>
            {availableSymbols.map((symbolName) => (
              <SymbolButton 
                key={symbolName} 
                symbolName={symbolName} 
                onClick={(e) => onSelectSymbol(e, symbolName)}
                isFavorite={favoriteSymbols.includes(symbolName)}
                onToggleFavorite={toggleFavorite ? () => toggleFavorite(symbolName) : undefined}
              />
            ))}
          </div>
          {/* Removed bottom close button as it's now hidden via CSS and replaced with the X button */}
        </div>
      </div>
    </div>
  );
};

export default SymbolSelectionPopup;