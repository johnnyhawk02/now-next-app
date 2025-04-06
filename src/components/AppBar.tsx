import React from 'react';
import styles from './AppBar.module.css';

interface AppBarProps {
  title: string;
  onEditModeToggle: () => void;
  isEditMode: boolean;
  autoAnnounce?: boolean;
  onToggleAutoAnnounce?: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ 
  title, 
  onEditModeToggle, 
  isEditMode,
  autoAnnounce = true,
  onToggleAutoAnnounce
}) => {
  return (
    <header className={styles.appBar}>
      <div className={styles.appBarContent}>
        <h1 className={styles.title}>{title}</h1>
        
        <div className={styles.actions}>
          {onToggleAutoAnnounce && (
            <label className={styles.voiceToggleLabel} title="Siri Voice Announcements">
              <span className={styles.voiceText}>Voice</span>
              <input
                type="checkbox"
                className={styles.voiceToggle}
                checked={autoAnnounce}
                onChange={onToggleAutoAnnounce}
              />
              <span className={`${styles.toggleSlider} ${styles.voiceSlider}`}></span>
            </label>
          )}
          
          <label className={styles.editModeToggleLabel}>
            <span className={styles.editModeText}>Edit</span>
            <input
              type="checkbox"
              className={styles.editModeToggle}
              checked={isEditMode}
              onChange={onEditModeToggle}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
      </div>
    </header>
  );
};

export default AppBar;