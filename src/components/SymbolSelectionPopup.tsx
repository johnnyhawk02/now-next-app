import React from 'react';
import SymbolButton from './SymbolButton';
import styles from './SymbolSelectionPopup.module.css';

interface SymbolSelectionPopupProps {
  isOpen: boolean;
  popupType: 'now' | 'next' | 'sequence' | null;
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
  
  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.popupTitle}>
          {popupType === 'now' && 'Select Now Symbol'}
          {popupType === 'next' && 'Select Next Symbol'}
          {popupType === 'sequence' && (
            <>
              Create Sequence
              <div className={styles.sequenceInfo}>
                Selected: {sequenceLength} symbols
              </div>
            </>
          )}
        </h2>
        
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
        <button onClick={onClose} className={styles.closeButton}>
          {popupType === 'sequence' ? 'Done' : 'Close'}
        </button>
      </div>
    </div>
  );
};

export default SymbolSelectionPopup;