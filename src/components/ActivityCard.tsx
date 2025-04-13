import React, { useState, useRef, useEffect } from 'react';
import { getSymbolByFilename } from '../data/symbols';
import { playAudioForWord } from '../utils/speech';
import styles from './ActivityCard.module.css';

interface ActivityCardProps {
  title: string;
  symbolFilename: string | null;
  onChangeSymbol: () => void;
  onRemove?: () => void;
}

const LONG_PRESS_DURATION = 800;

const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  symbolFilename,
  onChangeSymbol,
  onRemove,
}) => {
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggered = useRef(false);
  const [isPressing, setIsPressing] = useState(false);

  const handlePressStart = (_e: React.TouchEvent | React.MouseEvent) => {
    _e.preventDefault();
    setIsPressing(true);
    longPressTriggered.current = false;

    if (pressTimer.current) clearTimeout(pressTimer.current);

    pressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
    }, LONG_PRESS_DURATION);
  };

  const handlePressEnd = () => {
    setIsPressing(false);
    if (pressTimer.current) clearTimeout(pressTimer.current);

    if (longPressTriggered.current) {
      onChangeSymbol();
    } else {
      if (symbolFilename) {
        const symbol = getSymbolByFilename(symbolFilename);
        const audioName = symbol?.displayName || symbolFilename.split('.')[0].replace(/([A-Z])/g, ' $1').trim().toLowerCase();
        playAudioForWord(audioName);
      }
    }
  };

  useEffect(() => {
    return () => { if (pressTimer.current) clearTimeout(pressTimer.current); };
  }, []);

  const cardStyle: React.CSSProperties = { cursor: 'pointer', width: '100%', maxWidth: '100%' };

  return (
    <div
      className={styles.container}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      {onRemove && symbolFilename !== 'finished.png' && (
        <button className={styles.removeButton} onClick={(e) => { e.stopPropagation(); if (onRemove) onRemove(); }} aria-label={`Remove ${title}`}>✕</button>
      )}

      <div
        className={`${styles.card} ${isPressing ? styles.pressing : ''}`}
        style={cardStyle}
      >
        {symbolFilename ? (
          <img src={`/symbols/${symbolFilename}`} alt={title} className={styles.symbolImage} style={{ width: '100%', maxWidth: '100%', objectFit: 'contain', pointerEvents: 'none'}} />
        ) : (
          <p className={styles.placeholderText}>No Symbol</p>
        )}
        <h2>{title}</h2>
      </div>
    </div>
  );
};

export default ActivityCard;