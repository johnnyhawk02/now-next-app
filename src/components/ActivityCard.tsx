import React from 'react';
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
  return (
    <div className={styles.container}>
      <div className={styles.toggleContainer}>
        <label className={styles.toggleLabel}>
   
        </label>
      </div>
      <div
        className={`${styles.card} ${isFocus ? styles.focusCard : ''}`}
        onClick={isEditMode ? onClick : undefined}
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