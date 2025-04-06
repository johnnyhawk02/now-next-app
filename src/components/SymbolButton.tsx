import React from 'react';
import { getSymbolByFilename } from '../data/symbols';
import styles from './SymbolButton.module.css';

interface SymbolButtonProps {
  symbolName: string; // This is actually the filename
  onClick: (e: React.MouseEvent) => void;
  isNow?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const SymbolButton: React.FC<SymbolButtonProps> = ({ 
  symbolName, 
  onClick, 
  isNow = false,
  isFavorite = false,
  onToggleFavorite
}) => {
  const buttonClasses = `${styles.symbolButton} ${isNow ? styles.nowSymbol : ''}`;
  const symbol = getSymbolByFilename(symbolName);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  return (
    <button 
      onClick={onClick} 
      className={buttonClasses}
    >
      <img 
        className={styles.symbolImage}
        src={`/symbols/${symbolName}`} 
        alt={symbol?.displayName || symbolName.split('.')[0]}
        title={symbol?.displayName}
      />
      {isNow && <div className={styles.nowIndicator}>NOW</div>}
      
      {onToggleFavorite && (
        <span 
          className={`${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''}`}
          onClick={handleFavoriteClick}
          role="button"
          tabIndex={0}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleFavoriteClick(e as unknown as React.MouseEvent);
            }
          }}
        >
          {isFavorite ? '★' : '☆'}
        </span>
      )}
      
      <span className={styles.symbolName}>
        {symbol?.displayName || symbolName.split('.')[0].replace(/([A-Z])/g, ' $1').trim()}
      </span>
    </button>
  );
};

export default SymbolButton;