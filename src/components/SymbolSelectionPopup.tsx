import React from 'react';
import SymbolButton from './SymbolButton';
import styles from './SymbolSelectionPopup.module.css';

interface SymbolSelectionPopupProps {
  isOpen: boolean;
  popupType: 'now' | 'next' | 'sequence' | null;
  title?: string;
  onClose: () => void;
  onSelectSymbol: (e: React.MouseEvent, symbolName: string) => void;
  availableSymbols: string[];
  sequenceLength?: number;
}

const SymbolSelectionPopup: React.FC<SymbolSelectionPopupProps> = ({
  isOpen,
  popupType,
  onClose,
  onSelectSymbol,
  availableSymbols,
  sequenceLength = 0
}) => {
  if (!isOpen) return null;
  
  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.popupTitle}>
          {popupType === 'now' && 'Select Now Symbol'}
          {popupType === 'next' && 'Select Next Symbol'}
          {popupType === 'sequence' && (
            <>
              Create Sequence
              <div className={styles.sequenceInfo}>
                Selected: {sequenceLength} symbols
              </div>
            </>
          )}
        </h2>
        <div className={styles.symbolGrid}>
          {availableSymbols.map((symbolName) => (
            <SymbolButton 
              key={symbolName} 
              symbolName={symbolName} 
              onClick={(e) => onSelectSymbol(e, symbolName)}
            />
          ))}
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          {popupType === 'sequence' ? 'Done' : 'Close'}
        </button>
      </div>
    </div>
  );
};

export default SymbolSelectionPopup;