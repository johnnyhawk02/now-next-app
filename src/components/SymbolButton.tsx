import React from 'react';
import styles from './SymbolButton.module.css';

interface SymbolButtonProps {
  symbolName: string;
  onClick: (e: React.MouseEvent) => void;
}

const SymbolButton: React.FC<SymbolButtonProps> = ({ symbolName, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className={styles.symbolButton}
    >
      <img 
        className={styles.symbolImage}
        src={`/symbols/${symbolName}`} 
        alt={symbolName.split('.')[0]} 
      />
      <span className={styles.symbolName}>{symbolName.split('.')[0].replace(/[-_]/g, ' ')}</span>
    </button>
  );
};

export default SymbolButton;