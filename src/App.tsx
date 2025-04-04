import { useState, useEffect, memo } from 'react';
import ActivityCard from './components/ActivityCard.tsx';
import './index.css';

// --- IMPORTANT ---
// Manually list your available symbol filenames here.
// The app needs to know which files exist in public/symbols/
const AVAILABLE_SYMBOLS = [
  'bath.png',
  'brush teeth girl.png',
  'bunk beds.png',
  'dream machine.png',
  // 'finished.png' is removed as requested
];
// --- END IMPORTANT ---

// Memoized symbol button to prevent unnecessary re-renders
const SymbolButton = memo(({ symbolName, onSelect }: { symbolName: string, onSelect: (name: string) => void }) => {
  return (
    <button
      key={symbolName}
      onClick={() => onSelect(symbolName)}
      className="p-2 bg-white rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label={`Select ${symbolName.split('.')[0]} as next activity`} 
    >
      <img
        src={`/symbols/${symbolName}`}
        alt={symbolName.split('.')[0]} 
        className="w-16 h-16 object-contain sm:w-20 sm:h-20"
      />
      <p className="text-sm mt-1 text-center text-gray-600">
        {symbolName.split('.')[0].replace(/[-_]/g, ' ')}
      </p>
    </button>
  );
});

// Memoized modal component
const SymbolModal = memo(({ isOpen, onClose, onSelectSymbol, title }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSelectSymbol: (name: string) => void,
  title: string
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-11/12 max-h-[90vh] overflow-y-auto animate-scaleIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            &times;
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {AVAILABLE_SYMBOLS.map((symbolName) => (
            <SymbolButton 
              key={symbolName} 
              symbolName={symbolName} 
              onSelect={onSelectSymbol} 
            />
          ))}
        </div>
      </div>
    </div>
  );
});

function App() {
  // State to hold the filename of the symbol for "Now" and "Next"
  const [nowSymbol, setNowSymbol] = useState<string | null>(null);
  const [nextSymbol, setNextSymbol] = useState<string | null>(null);
  
  // State to control visibility of the symbol selector modals
  const [isNowModalOpen, setIsNowModalOpen] = useState(false);
  const [isNextModalOpen, setIsNextModalOpen] = useState(false);

  // Function to handle selecting the now symbol
  const handleSelectNow = (symbolName: string) => {
    setNowSymbol(symbolName);
    setIsNowModalOpen(false);
  };

  // Function to handle selecting the next symbol
  const handleSelectNext = (symbolName: string) => {
    setNextSymbol(symbolName);
    setIsNextModalOpen(false);
  };

  // Function to handle the transition
  const handleFinishNow = () => {
    if (!nextSymbol) {
      alert("Please select the 'Next' activity first.");
      setIsNextModalOpen(true);
      return;
    }
    // Move "Next" to "Now"
    setNowSymbol(nextSymbol);
    // Clear "Next" and prompt for new next
    setNextSymbol(null);
    setIsNextModalOpen(true);
  };

  // Show modal on initial load if no symbols selected
  useEffect(() => {
    if (!nextSymbol && !nowSymbol) {
      setIsNextModalOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 bg-blue-50 sm:p-4"> 
      {/* Now and Next Cards */}
      <div className="flex flex-col items-center justify-center gap-4 mb-4 
                    sm:flex-row sm:gap-6 sm:mb-6 
                    md:gap-8">
        <ActivityCard title="Now" symbolFilename={nowSymbol} />
        <ActivityCard title="Next" symbolFilename={nextSymbol} />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-4 flex-wrap justify-center">
        <button
          onClick={() => setIsNowModalOpen(true)}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md text-lg shadow-md 
                  sm:py-3 sm:px-6 sm:rounded-lg sm:text-xl transition-all duration-200"
        >
          {nowSymbol ? "Change Now" : "Choose Now"}
        </button>
        
        <button
          onClick={() => setIsNextModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-lg shadow-md 
                  sm:py-3 sm:px-6 sm:rounded-lg sm:text-xl transition-all duration-200"
        >
          {nextSymbol ? "Change Next" : "Choose Next"}
        </button>
        
        {nowSymbol && nextSymbol && (
          <button
            onClick={handleFinishNow}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md text-lg shadow-md 
                    sm:py-3 sm:px-6 sm:rounded-lg sm:text-xl transition-all duration-200"
          >
            Finish Now ✅
          </button>
        )}
      </div>

      {/* Modals for Symbol Selection */}
      <SymbolModal 
        isOpen={isNowModalOpen} 
        onClose={() => setIsNowModalOpen(false)} 
        onSelectSymbol={handleSelectNow} 
        title="Choose Now Activity"
      />
      
      <SymbolModal 
        isOpen={isNextModalOpen} 
        onClose={() => setIsNextModalOpen(false)} 
        onSelectSymbol={handleSelectNext}
        title="Choose Next Activity" 
      />
    </div>
  );
}

export default App;