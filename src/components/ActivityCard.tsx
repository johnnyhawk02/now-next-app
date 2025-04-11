import React from 'react';
import { getSymbolByFilename } from '../data/symbols';
import { playAudioForWord } from '../utils/speech';
import styles from './ActivityCard.module.css';

interface ActivityCardProps {
  title: string;
  symbolFilename: string | null;
  onClick?: () => void;
  isFocus?: boolean;
  isEditMode?: boolean;
  onRemove?: () => void; // New prop for handling removal
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  symbolFilename,
  onClick,
  isFocus,
  isEditMode,
  onRemove,
}) => {
  const handleCardClick = () => {
    if (isEditMode && onClick) {
      onClick();
    } else if (symbolFilename) {
      // In non-edit mode, play the audio for this symbol
      const symbol = getSymbolByFilename(symbolFilename);
      const audioName = symbol?.displayName || symbolFilename.split('.')[0].replace(/([A-Z])/g, ' $1').trim().toLowerCase();
      
      // Use our audio player utility
      playAudioForWord(audioName);
    }
  };

  return (
    <div className={styles.container}>
      {isEditMode && symbolFilename !== 'finished.png' && (
        <button
          className={styles.removeButton} // Add styling for the remove button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card click
            if (onRemove) onRemove();
          }}
        >
          X
        </button>
      )}
      <div
        className={`${styles.card} ${isFocus ? styles.focusCard : ''}`}
        onClick={handleCardClick}
        style={{ 
          cursor: 'pointer',
          width: '100%', 
          maxWidth: '100%' 
        }}
      >
        {symbolFilename ? (
          <img
            src={`/symbols/${symbolFilename}`}
            alt={title}
            className={styles.symbolImage}
            style={{ 
              width: '100%', 
              maxWidth: '100%', 
              objectFit: 'contain' 
            }}
          />
        ) : (
          <p className={styles.placeholderText}>No Symbol</p>
        )}
        <h2>{title}</h2>
      </div>
    </div>
  );
};

export default ActivityCard;