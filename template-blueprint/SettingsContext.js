import React, { createContext, useContext } from 'react';
import configData from './config.json'; // 1. Import the static JSON file!

// 2. We just read directly from the file, no database needed!
const SettingsContext = createContext({
  settings: configData
});

export function SettingsProvider({ children }) {
  return (
    <SettingsContext.Provider value={{ settings: configData }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
