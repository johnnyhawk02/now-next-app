import React, { useEffect, useState } from 'react';
import styles from './AppBar.module.css';

interface AppBarProps {
  title: string;
  onEditModeToggle: () => void;
  isEditMode: boolean;
  autoAnnounce?: boolean;
  onToggleAutoAnnounce?: () => void;
  onVoiceChange: (voiceURI: string) => void;
}

const AppBar: React.FC<AppBarProps> = ({ 
  title, 
  onEditModeToggle, 
  isEditMode,
  autoAnnounce = true,
  onToggleAutoAnnounce,
  onVoiceChange
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Retry loading voices if they are not immediately available
    const retryInterval = setInterval(() => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        clearInterval(retryInterval);
      }
    }, 500);

    loadVoices();

    return () => clearInterval(retryInterval);
  }, []); // Remove voices from the dependency array to avoid infinite loop

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

          <select
            className={styles.voiceSelector}
            onChange={(e) => onVoiceChange(e.target.value)}
            aria-label="Select TTS Voice"
          >
            {voices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

export default AppBar;