import React from 'react';
import styles from './BurgerMenu.module.css';

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: 'now' | 'next' | 'sequence') => void;
  onFinishNow: () => void;
  onFeedSequence: () => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({
  isOpen,
  onClose,
  onSelectOption,
  onFinishNow,
  onFeedSequence
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.menuPopup}>
      <button onClick={onClose} className={styles.closeButton}>&times;</button>
      <div className={styles.menuContent}>
        <button className={styles.menuButton} onClick={() => onSelectOption('now')}>Choose Now</button>
        <button className={styles.menuButton} onClick={() => onSelectOption('next')}>Choose Next</button>
        <button className={styles.menuButton} onClick={onFinishNow}>Finish Now</button>
        <button className={styles.menuButton} onClick={() => onSelectOption('sequence')}>Create Sequence</button>
        <button className={styles.menuButton} onClick={onFeedSequence}>Feed Sequence</button>
      </div>
    </div>
  );
};

export default BurgerMenu;