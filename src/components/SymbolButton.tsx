import React from 'react';
import styles from './SymbolButton.module.css';

interface SymbolButtonProps {
  symbolName: string;
  onClick: (e: React.MouseEvent) => void;
  isNow?: boolean; // New prop to indicate if this is the 'now' symbol
}

const SymbolButton: React.FC<SymbolButtonProps> = ({ symbolName, onClick, isNow = false }) => {
  // Determine CSS classes based on isNow prop
  const buttonClasses = `${styles.symbolButton} ${isNow ? styles.nowSymbol : ''}`;

  return (
    <button 
      onClick={onClick} 
      className={buttonClasses}
    >
      <img 
        className={styles.symbolImage}
        src={`/symbols/${symbolName}`} 
        alt={symbolName.split('.')[0]} 
      />
      {isNow && <div className={styles.nowIndicator}>NOW</div>}
    </button>
  );
};

export default SymbolButton;