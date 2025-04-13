import React from 'react';
import styles from './LongPressIndicator.module.css';

interface LongPressIndicatorProps {
  // No props needed now
}

const LongPressIndicator: React.FC<LongPressIndicatorProps> = () => {
  return (
    <div className={styles.indicatorContainer}>
      {/* No inner bar needed for border-only style */}
    </div>
  );
};

export default LongPressIndicator; 