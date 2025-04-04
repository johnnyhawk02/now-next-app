import { useState, useEffect } from 'react';
import ActivityCard from './components/ActivityCard.tsx';
import './styles.css';

const AVAILABLE_SYMBOLS = [
  'bath.png',
  'brush teeth girl.png',
  'bunk beds.png',
  'dream machine.png',
];

const App = () => {
  const [nowSymbol, setNowSymbol] = useState<string | null>(null);
  const [nextSymbol, setNextSymbol] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<'now' | 'next' | 'sequence' | null>(null);
  const [sequence, setSequence] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Modified handler with direct event parameter
  const handleSelectSymbol = (e: React.MouseEvent, symbolName: string) => {
    // Stop event propagation to prevent any parent handlers from firing
    e.stopPropagation();
    
    console.log(`Symbol selected: ${symbolName}`);
    console.log(`Popup type: ${isPopupOpen}`);

    if (isPopupOpen === 'now') {
      setNowSymbol(symbolName);
      console.log(`Now symbol set to: ${symbolName}`);
      setIsPopupOpen(null);
    } else if (isPopupOpen === 'next') {
      setNextSymbol(symbolName);
      console.log(`Next symbol set to: ${symbolName}`);
      setIsPopupOpen(null);
    } else if (isPopupOpen === 'sequence') {
      setSequence(prev => [...prev, symbolName]);
      console.log(`Sequence updated with: ${symbolName}`);
      // Keep popup open for sequence creation
    }
  };

  const handleFinishNow = () => {
    if (!nextSymbol) {
      alert("Please select the 'Next' activity first.");
      return;
    }
    setNowSymbol(nextSymbol);
    setNextSymbol(null);
    setIsMenuOpen(false);
  };

  const handleFeedSequence = () => {
    if (sequence.length > 0) {
      setNowSymbol(sequence[0]);
      setNextSymbol(sequence.length > 1 ? sequence[1] : null);
      setSequence(sequence.slice(sequence.length > 1 ? 2 : 1));
    } else {
      alert("The sequence is empty. Please create a sequence first.");
    }
    setIsMenuOpen(false);
  };

  const openPopup = (type: 'now' | 'next' | 'sequence') => {
    setIsPopupOpen(type);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (!nextSymbol && !nowSymbol) {
      setNextSymbol(AVAILABLE_SYMBOLS[0]);
    }
  }, [nowSymbol, nextSymbol]); // Added dependencies to keep the array size consistent

  return (
    <div>
      <h1>Activity Planner</h1>
      <div className="grid">
        <ActivityCard 
          title="Now" 
          symbolFilename={nowSymbol} 
          onClick={() => openPopup('now')} // Add click handler to open the Now popup
        />
        <ActivityCard 
          title="Next" 
          symbolFilename={nextSymbol} 
          onClick={() => openPopup('next')} // Add click handler to open the Next popup
        />
      </div>

      {/* Burger Menu Button */}
      <button onClick={() => setIsMenuOpen(true)} className="burger-button">
        ☰
      </button>

      {/* Menu Popup */}
      {isMenuOpen && (
        <div className="menu-popup">
          <button onClick={() => setIsMenuOpen(false)} className="close-button">&times;</button>
          <div className="menu-content">
            <button onClick={() => openPopup('now')}>Choose Now</button>
            <button onClick={() => openPopup('next')}>Choose Next</button>
            <button onClick={handleFinishNow}>Finish Now</button>
            <button onClick={() => openPopup('sequence')}>Create Sequence</button>
            <button onClick={handleFeedSequence}>Feed Sequence</button>
          </div>
        </div>
      )}

      {/* Symbol Selection Popup */}
      {isPopupOpen && (
        <div className="popup-overlay" onClick={() => setIsPopupOpen(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>
              {isPopupOpen === 'now' && 'Select Now Symbol'}
              {isPopupOpen === 'next' && 'Select Next Symbol'}
              {isPopupOpen === 'sequence' && (
                <>
                  Create Sequence
                  <div className="sequence-info">
                    Selected: {sequence.length} symbols
                  </div>
                </>
              )}
            </h2>
            <div className="grid">
              {AVAILABLE_SYMBOLS.map((symbolName) => (
                <button 
                  key={symbolName}
                  onClick={(e) => handleSelectSymbol(e, symbolName)} 
                  className="symbol-button"
                >
                  <img src={`/symbols/${symbolName}`} alt={symbolName.split('.')[0]} />
                  <span>{symbolName.split('.')[0].replace(/[-_]/g, ' ')}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setIsPopupOpen(null)} className="close-button">
              {isPopupOpen === 'sequence' ? 'Done' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;