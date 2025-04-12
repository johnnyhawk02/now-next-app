import React from 'react';
import SymbolButton from './SymbolButton';
import styles from './SymbolSelectionPopup.module.css';

interface SymbolSelectionPopupProps {
  isOpen: boolean;
  popupType: 'next' | null;
  title?: string;
  onClose: () => void;
  onSelectSymbol: (e: React.MouseEvent, symbolName: string) => void;
  availableSymbols: string[];
  tags?: string[];
  activeTag?: string | 'Favorites' | 'All';
  setActiveTag?: (tag: string | 'Favorites' | 'All') => void;
  favoriteSymbols?: string[];
  toggleFavorite?: (symbolName: string) => void;
}

const SymbolSelectionPopup: React.FC<SymbolSelectionPopupProps> = ({
  isOpen,
  popupType,
  onClose,
  onSelectSymbol,
  availableSymbols,
  tags = [],
  activeTag = 'All',
  setActiveTag,
  favoriteSymbols = [],
  toggleFavorite
}) => {
  if (!isOpen) return null;
  
  const dynamicTitle = 'Select Symbol';

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <h2 className={styles.popupTitle}>
              {dynamicTitle}
            </h2>
            <button className={styles.closeX} onClick={onClose}>✕</button>
          </div>
          
          {tags.length > 0 && (
            <div className={styles.tagTabs}>
              <button 
                className={`${styles.tagTab} ${activeTag === 'All' ? styles.activeTab : ''}`}
                onClick={() => setActiveTag && setActiveTag('All')}
              >
                All
              </button>
              <button 
                className={`${styles.tagTab} ${activeTag === 'Favorites' ? styles.activeTab : ''}`}
                onClick={() => setActiveTag && setActiveTag('Favorites')}
              >
                ⭐ Favorites
              </button>
              {tags.filter(tag => tag !== 'All' && tag !== 'Favorites').map(tag => (
                <button 
                  key={tag}
                  className={`${styles.tagTab} ${activeTag === tag ? styles.activeTab : ''}`}
                  onClick={() => setActiveTag && setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
        
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
        </div>
      </div>
    </div>
  );
};

export default SymbolSelectionPopup;