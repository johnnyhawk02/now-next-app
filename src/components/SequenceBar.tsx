import React from 'react';
import { Sequence } from '../data/sequences';
import { getSymbolById } from '../data/symbols';
import styles from './SequenceBar.module.css';

interface SequenceBarProps {
  sequences: Sequence[];
  selectedSequenceId: string | null;
  currentStepIndex: number;
  onSelectSequence: (sequenceId: string) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
}

const SequenceBar: React.FC<SequenceBarProps> = ({
  sequences,
  selectedSequenceId,
  currentStepIndex,
  onSelectSequence,
  onPrevStep,
  onNextStep
}) => {
  const selectedSequence = sequences.find(seq => seq.id === selectedSequenceId);
  const totalSteps = selectedSequence ? selectedSequence.symbolIds.length : 0;
  
  
  
  return (
    <div className={styles.sequenceBar}>
      <div className={styles.navigationControls}>
        <button 
          className={styles.navButton}
          onClick={onPrevStep}
          disabled={!selectedSequence || currentStepIndex <= 0}
          aria-label="Previous step"
        >
          ◀
        </button>
        
        <div className={styles.sequenceSelector}>
          <select
            className={styles.sequenceDropdown}
            value={selectedSequenceId || ''}
            onChange={(e) => onSelectSequence(e.target.value)}
            aria-label="Select sequence"
          >
            <option value="">Select Sequence</option>
            {sequences.map(sequence => (
              <option key={sequence.id} value={sequence.id}>
                {sequence.name}
              </option>
            ))}
          </select>
          
          {selectedSequence && (
            <div className={styles.stepIndicator}>
              {currentStepIndex + 1} / {totalSteps}
            </div>
          )}
        </div>
        
        <button 
          className={styles.navButton}
          onClick={onNextStep}
          disabled={!selectedSequence || currentStepIndex >= totalSteps - 1}
          aria-label="Next step"
        >
          ▶
        </button>
      </div>
      
      {selectedSequence && (
        <div className={styles.previewContainer}>
          {selectedSequence.symbolIds.map((symbolId, index) => {
            const symbol = getSymbolById(symbolId);
            if (!symbol) return null;
            
            return (
              <div 
                key={`${symbolId}-${index}`} 
                className={`${styles.previewItem} ${index === currentStepIndex ? styles.currentStep : ''}`}
              >
                <img 
                  src={`/symbols/${symbol.filename}`} 
                  alt={symbol.displayName}
                  className={styles.previewImage}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SequenceBar;