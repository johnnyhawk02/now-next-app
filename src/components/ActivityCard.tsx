import React from 'react';
import { getSymbolByFilename } from '../data/symbols';
import styles from './ActivityCard.module.css';

interface ActivityCardProps {
  title: string;
  symbolFilename: string | null;
  onClick?: () => void;
  isFocus?: boolean;
  isEditMode?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  symbolFilename,
  onClick,
  isFocus,
  isEditMode,
}) => {
  const handleCardClick = () => {
    if (isEditMode && onClick) {
      onClick();
    } else if (symbolFilename) {
      // In non-edit mode, speak the symbol name using text-to-speech
      const symbol = getSymbolByFilename(symbolFilename);
      const textToSpeak = symbol?.displayName || symbolFilename.split('.')[0].replace(/([A-Z])/g, ' $1').trim();
      
      // Use the Web Speech API for text-to-speech
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        // Use a slightly slower rate and higher pitch for clearer speech for children
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.toggleContainer}>
        <label className={styles.toggleLabel}>
   
        </label>
      </div>
      <div
        className={`${styles.card} ${isFocus ? styles.focusCard : ''}`}
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }} // Always show pointer cursor for better UX
      >
        {symbolFilename ? (
          <img
            src={`/symbols/${symbolFilename}`}
            alt={title}
            className={styles.symbolImage}
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