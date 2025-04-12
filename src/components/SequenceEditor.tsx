import React, { useState, useEffect } from 'react';
import { Sequence } from '../data/sequences';
import { SYMBOLS, getSymbolById } from '../data/symbols';
import styles from './SequenceEditor.module.css';
import SymbolSelectionPopup from './SymbolSelectionPopup';

interface SequenceEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSequence: (sequence: Sequence) => void;
  initialSequence?: Sequence;
  allSequences: Sequence[];
}

const SequenceEditor: React.FC<SequenceEditorProps> = ({
  isOpen,
  onClose,
  onSaveSequence,
  initialSequence,
  allSequences
}) => {
  const [sequenceName, setSequenceName] = useState(initialSequence?.name || '');
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(initialSequence?.symbolIds || []);
  const [error, setError] = useState('');
  const [isSymbolPopupOpen, setIsSymbolPopupOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | 'Favorites'>('Favorites');
  const [favoriteSymbols, setFavoriteSymbols] = useState<string[]>([]);
  const [insertionIndex, setInsertionIndex] = useState(initialSequence?.symbolIds.length || 0);

  useEffect(() => {
    setInsertionIndex(initialSequence?.symbolIds.length || selectedSymbols.length);
  }, [initialSequence, selectedSymbols.length]);

  // Generate a unique ID for new sequences
  const generateUniqueId = () => {
    const baseId = sequenceName.toLowerCase().replace(/\s+/g, '-');
    let uniqueId = baseId;
    let counter = 1;
    
    // Check if ID already exists and increment counter until we find a unique one
    while (allSequences.some(seq => seq.id === uniqueId)) {
      uniqueId = `${baseId}-${counter}`;
      counter++;
    }
    
    return uniqueId;
  };

  const handleSave = () => {
    // Validation
    if (!sequenceName.trim()) {
      setError('Please enter a sequence name');
      return;
    }
    
    if (selectedSymbols.length === 0) {
      setError('Please add at least one symbol to the sequence');
      return;
    }

    // Clear any previous error
    setError('');
    
    // Create the sequence object
    const newSequence: Sequence = {
      id: initialSequence?.id || generateUniqueId(),
      name: sequenceName.trim(),
      symbolIds: [...selectedSymbols]
    };
    
    // Save the sequence
    onSaveSequence(newSequence);
    
    // Close the editor
    onClose();
  };

  const addSymbol = (symbolId: string) => {
    setSelectedSymbols(prev => {
      const updated = [...prev];
      updated.splice(insertionIndex, 0, symbolId);
      setInsertionIndex(updated.length);
      return updated;
    });
  };

  const removeSymbol = (index: number) => {
    setSelectedSymbols(prev => {
      const updated = prev.filter((_, i) => i !== index);
      setInsertionIndex(updated.length);
      return updated;
    });
  };

  // Updated moveSymbol to handle left/right shifts
  const moveSymbol = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;

    // Basic bounds check
    if (newIndex < 0 || newIndex >= selectedSymbols.length) {
      return; 
    }

    setSelectedSymbols(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[newIndex];
      updated[newIndex] = temp;
      setInsertionIndex(updated.length);
      return updated;
    });
  };

  // Handle selecting a symbol from the popup
  const handleSelectSymbol = (e: React.MouseEvent, symbolFilename: string) => {
    e.stopPropagation();
    
    // Get the symbol ID from the filename
    const symbol = SYMBOLS.find(s => s.filename === symbolFilename);
    if (symbol) {
      addSymbol(symbol.id);
    }
    
    // Close the popup
    setIsSymbolPopupOpen(false);
  };

  // Toggle a symbol as favorite (dummy implementation - would integrate with app-wide favorites)
  const toggleFavorite = (symbolName: string) => {
    setFavoriteSymbols(prev => 
      prev.includes(symbolName)
        ? prev.filter(name => name !== symbolName)
        : [...prev, symbolName]
    );
  };

  // Get all available symbol filenames for the popup
  const getAllSymbolFilenames = () => {
    return SYMBOLS.map(symbol => symbol.filename);
  };

  // Get all categories
  const getAllCategories = () => {
    const categories = new Set<string>();
    SYMBOLS.forEach(symbol => {
      if (symbol.categories) {
        symbol.categories.forEach(category => categories.add(category));
      }
    });
    return Array.from(categories);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.editor} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>
          {initialSequence ? 'Edit Sequence' : 'Create New Sequence'}
        </h2>
        
        <div className={styles.formGroup}>
          <label htmlFor="sequence-name" className={styles.label}>Sequence Name:</label>
          <input
            id="sequence-name"
            type="text"
            className={styles.input}
            value={sequenceName}
            onChange={e => setSequenceName(e.target.value)}
            placeholder="Enter sequence name"
          />
        </div>

        <div className={styles.symbolsContainer}>
          <h3 className={styles.subtitle}>Selected Sequence:</h3>

          {selectedSymbols.length === 0 ? (
            <p className={styles.emptyMessage}>No symbols added yet. Add symbols from below.</p>
          ) : (
            <div className={styles.selectedSymbolsFlow}>
              <div 
                className={`${styles.insertionPointContainer} ${insertionIndex === 0 ? styles.insertionPointActive : ''}`}
                onClick={() => setInsertionIndex(0)} 
                title="Insert here"
              >
                <div className={styles.insertionPointMarker}></div>
              </div>

              {selectedSymbols.map((symbolId, index) => {
                const symbol = getSymbolById(symbolId);
                if (!symbol) return null;

                return (
                  <React.Fragment key={`${symbolId}-${index}`}>
                    <div 
                      className={styles.selectedSymbolChip} 
                      onClick={() => setInsertionIndex(index + 1)}
                      title={symbol.displayName}
                    >
                      <img
                        src={`/symbols/${symbol.filename}`}
                        alt={symbol.displayName}
                        className={styles.symbolImageMedium}
                      />
                      <button
                        className={styles.removeSymbolButton}
                        onClick={(e) => { e.stopPropagation(); removeSymbol(index); }}
                        aria-label={`Remove ${symbol.displayName}`}
                        title={`Remove ${symbol.displayName}`}
                      >
                        ✕
                      </button>
                      <button
                        className={`${styles.moveButton} ${styles.moveLeftButton}`}
                        onClick={(e) => { e.stopPropagation(); moveSymbol(index, 'left'); }}
                        disabled={index === 0}
                        aria-label="Move Left"
                        title="Move Left"
                      >
                        ←
                      </button>
                      <button
                        className={`${styles.moveButton} ${styles.moveRightButton}`}
                        onClick={(e) => { e.stopPropagation(); moveSymbol(index, 'right'); }}
                        disabled={index === selectedSymbols.length - 1}
                        aria-label="Move Right"
                        title="Move Right"
                      >
                        →
                      </button>
                    </div>

                    <div 
                      className={`${styles.insertionPointContainer} ${insertionIndex === index + 1 ? styles.insertionPointActive : ''}`}
                      onClick={() => setInsertionIndex(index + 1)} 
                      title="Insert here"
                    >
                      <div className={styles.insertionPointMarker}></div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}

          <h3 className={styles.subtitle}>Add Symbols:</h3>
          <div className={styles.availableSymbolsList}>
            {SYMBOLS.slice(0, 20).map(symbol => (
              <div
                key={symbol.id}
                className={styles.symbolOptionItem}
                onClick={() => addSymbol(symbol.id)}
                title={`Add ${symbol.displayName}`}
              >
                <img
                  src={`/symbols/${symbol.filename}`}
                  alt={symbol.displayName}
                  className={styles.symbolImageMedium}
                />
                <span className={styles.symbolNameSmall}>{symbol.displayName}</span>
              </div>
            ))}
          </div>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            Save Sequence
          </button>
        </div>
      </div>

      {/* Symbol Selection Popup */}
      <SymbolSelectionPopup
        isOpen={isSymbolPopupOpen}
        popupType={null} // Using null since we don't need Now/Next distinction
        onClose={() => setIsSymbolPopupOpen(false)}
        onSelectSymbol={handleSelectSymbol}
        availableSymbols={getAllSymbolFilenames()}
        categories={getAllCategories()}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        favoriteSymbols={favoriteSymbols}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default SequenceEditor;