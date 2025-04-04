import { FC, SyntheticEvent } from 'react';

// Define props interface
interface ActivityCardProps {
  title: string;
  symbolFilename: string | null; // Can be string or null
  onClick?: () => void; // Add onClick prop
}

const ActivityCard: FC<ActivityCardProps> = ({ title, symbolFilename, onClick }) => {
  const imageSrc = symbolFilename
    ? `/symbols/${symbolFilename}`
    : ''; // No placeholder, will show empty state

  // Handle potential image loading errors
  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`Error loading image: ${imageSrc}`);
  };

  return (
    <div className="card" onClick={onClick}>
      <h2>{title}</h2>
      <div>
        {symbolFilename ? (
          <img
            key={imageSrc}
            src={imageSrc}
            alt={`${title} activity: ${symbolFilename}`}
            onError={handleError}
          />
        ) : (
          <div className="text-gray-400">
            <p>No activity selected</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityCard;