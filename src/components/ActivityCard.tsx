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
  const rectRef = useRef<SVGRectElement>(null); // Ref for the rect
  const [perimeter, setPerimeter] = useState(0); // State for perimeter

  // Calculate perimeter on mount
  useEffect(() => {
    if (rectRef.current) {
      const length = rectRef.current.getTotalLength();
      setPerimeter(length);
    }
  }, []); // Runs once on mount

  const handlePressStart = (_e: React.TouchEvent | React.MouseEvent) => {
    // Prevent default actions like text selection or magnifier loop
    _e.preventDefault();

    setIsPressing(true);
    longPressTriggered.current = false;
    
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }

    pressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      console.log('Long press threshold met');
    }, LONG_PRESS_DURATION);
  };

  const handlePressEnd = () => {
    setIsPressing(false);

    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }

    if (longPressTriggered.current) {
      console.log('Long press detected -> opening popup');
      onChangeSymbol();
    } else {
      if (symbolFilename) {
        console.log('Short press -> playing audio');
        const symbol = getSymbolByFilename(symbolFilename);
        const audioName = symbol?.displayName || symbolFilename.split('.')[0].replace(/([A-Z])/g, ' $1').trim().toLowerCase();
        playAudioForWord(audioName);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
      }
    };
  }, []);

  // Basic card style (padding etc handled in CSS)
  const cardStyle: React.CSSProperties = {
    cursor: 'pointer',
    width: '100%',
    maxWidth: '100%',
  };

  // SVG properties
  const strokeWidth = 3; // Border thickness
  // Use fixed known value (0.75rem = 12px approx) instead of reading CSS variable
  const cardBorderRadiusPx = 12; 
  const rectRx = Math.max(0, cardBorderRadiusPx - strokeWidth / 2);

  // Inline style for the rect using calculated perimeter
  const rectStyle: React.CSSProperties = {
    vectorEffect: "non-scaling-stroke",
    strokeDasharray: perimeter,
    strokeDashoffset: isPressing ? 0 : perimeter, // Animate TO 0 when pressing
    // Apply transition only when pressing, add delay
    transition: isPressing 
        ? `stroke-dashoffset ${LONG_PRESS_DURATION}ms linear 200ms` // Added 200ms delay
        : 'stroke-dashoffset 0.1s linear' // Quick reset transition (no delay needed)
  };

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
      <svg
        className={styles.borderSvg}
        preserveAspectRatio="none"
      >
        <rect
          ref={rectRef}
          className={styles.borderRect}
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={`calc(100% - ${strokeWidth}px)`}
          height={`calc(100% - ${strokeWidth}px)`}
          rx={rectRx}
          style={rectStyle}
        />
      </svg>

      {onRemove && symbolFilename !== 'finished.png' && (
        <button
          className={styles.removeButton}
          onClick={(e) => {
            e.stopPropagation();
            if (onRemove) onRemove();
          }}
          aria-label={`Remove ${title}`}
        >
          ✕
        </button>
      )}

      <div
        className={styles.card}
        style={cardStyle}
      >
        {symbolFilename ? (
          <img
            src={`/symbols/${symbolFilename}`}
            alt={title}
            className={styles.symbolImage}
            style={{ 
              width: '100%', 
              maxWidth: '100%', 
              objectFit: 'contain',
              pointerEvents: 'none'
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