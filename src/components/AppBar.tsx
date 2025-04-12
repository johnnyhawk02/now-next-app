import React from 'react';
import styles from './AppBar.module.css';

interface AppBarProps {
  title: string;
}

const AppBar: React.FC<AppBarProps> = ({ title }) => {
  return (
    <header className={styles.appBar}>
      <h1 className={styles.title}>{title}</h1>
    </header>
  );
};

export default AppBar;