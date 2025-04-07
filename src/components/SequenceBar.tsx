import React, { useState, useEffect } from 'react';
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
  onCreateSequence: () => void;
  onEditSequence: (sequence: Sequence) => void;
  onDeleteSequence: (sequenceId: string) => void;
  userCreatedSequences: boolean[];
  isEditMode: boolean;
}

const SequenceBar: React.FC<SequenceBarProps> = ({
  sequences,
  selectedSequenceId,
  currentStepIndex,
  onSelectSequence,
  onPrevStep,
  onNextStep,
  onCreateSequence,
  onEditSequence,
  onDeleteSequence,
  userCreatedSequences,
  isEditMode
}) => {
  const [expanded, setExpanded] = useState(isEditMode);
  const selectedSequence = sequences.find(seq => seq.id === selectedSequenceId);
  const totalSteps = selectedSequence ? selectedSequence.symbolIds.length : 0;
  const isUserCreated = selectedSequence ? userCreatedSequences[sequences.indexOf(selectedSequence)] : false;
  
  // Sync expanded state with edit mode
  useEffect(() => {
    setExpanded(isEditMode);
  }, [isEditMode]);
  
  // Get filename for current symbol in the sequence
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div className={`${styles.sequenceBar} ${expanded ? '' : styles.folded}`}>
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
            
            {/* Default sequences */}
            <optgroup label="Default Sequences">
              {sequences.filter((_, idx) => !userCreatedSequences[idx]).map(sequence => (
                <option key={sequence.id} value={sequence.id}>
                  {sequence.name}
                </option>
              ))}
            </optgroup>
            
            {/* User created sequences */}
            {sequences.some((_, idx) => userCreatedSequences[idx]) && (
              <optgroup label="My Sequences">
                {sequences.filter((_, idx) => userCreatedSequences[idx]).map(sequence => (
                  <option key={sequence.id} value={sequence.id}>
                    {sequence.name}
                  </option>
                ))}
              </optgroup>
            )}
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

        <button
          className={`${styles.foldButton} ${expanded ? styles.expanded : styles.collapsed}`}
          onClick={toggleExpanded}
          aria-label={expanded ? "Collapse sequence bar" : "Expand sequence bar"}
          title={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? '▼' : '▲'}
        </button>
      </div>
      
      {expanded && (
        <>
          <div className={styles.sequenceControls}>
            <button
              className={`${styles.controlButton} ${styles.createButton}`}
              onClick={onCreateSequence}
              aria-label="Create new sequence"
            >
              ✚ New
            </button>
            
            {selectedSequence && isUserCreated && (
              <>
                <button
                  className={`${styles.controlButton} ${styles.editButton}`}
                  onClick={() => onEditSequence(selectedSequence)}
                  aria-label="Edit sequence"
                >
                  ✎ Edit
                </button>
                <button
                  className={`${styles.controlButton} ${styles.deleteButton}`}
                  onClick={() => {
                    if (window.confirm(`Delete "${selectedSequence.name}" sequence?`)) {
                      onDeleteSequence(selectedSequence.id);
                    }
                  }}
                  aria-label="Delete sequence"
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
          
          {selectedSequence && (
            <div className={styles.previewContainer}>
              {selectedSequence.symbolIds.map((symbolId, index) => {
                const symbol = getSymbolById(symbolId);
                if (!symbol) return null;
                
                return (
                  <div 
                    key={`${selectedSequence.id}-${symbolId}-${index}`} 
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
        </>
      )}
    </div>
  );
};

export default SequenceBar;