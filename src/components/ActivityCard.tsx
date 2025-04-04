import { FC, SyntheticEvent } from 'react';

// Placeholder image path (relative to public folder)
const PLACEHOLDER_SYMBOL = '/symbols/finished.png'; // Or choose another default/empty symbol

// Define props interface
interface ActivityCardProps {
  title: string;
  symbolFilename: string | null; // Can be string or null
}

const ActivityCard: FC<ActivityCardProps> = ({ title, symbolFilename }) => {
  const imageSrc = symbolFilename
    ? `/symbols/${symbolFilename}`
    : PLACEHOLDER_SYMBOL; // Use placeholder if no symbol

  // Handle potential image loading errors (optional but good practice)
  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`Error loading image: ${imageSrc}`);
    // Type assertion needed for target.src
    (e.target as HTMLImageElement).src = PLACEHOLDER_SYMBOL; // Fallback to placeholder on error
  };

  return (
    // Mobile first: smaller base size, padding, border. Increase for sm+ screens.
    <div className="bg-white p-3 rounded-lg shadow-md text-center flex flex-col items-center w-36 h-48 border-2 border-gray-200 
                    sm:w-48 sm:h-64 sm:p-4 sm:rounded-xl sm:shadow-lg sm:border-4 
                    md:w-64 md:h-80 md:p-6">
      {/* Mobile first: smaller text. Increase for sm+ screens. */}
      <h2 className="text-lg font-bold mb-2 text-gray-700 
                     sm:text-xl sm:mb-3 
                     md:text-2xl md:mb-4">{title}</h2>
      <div className="flex-grow flex items-center justify-center w-full">
        {/* Container to help center image */}
        <img
          // Use a key to force re-render if the filename changes but URL is the same (less likely here but good practice)
          key={imageSrc}
          src={imageSrc}
          alt={`${title}: ${symbolFilename || 'No activity selected'}`}
          // Mobile first: smaller max height. Increase for sm+ screens.
          className="max-w-full max-h-24 object-contain 
                     sm:max-h-32 
                     md:max-h-48"
          onError={handleError}
        />
      </div>
    </div>
  );
}

export default ActivityCard;