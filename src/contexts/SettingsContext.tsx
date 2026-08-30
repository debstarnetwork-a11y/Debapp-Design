import React, { createContext, useContext, useState } from 'react';

type Settings = {
  email: string;
  phone: string;
  location: string;
  logoUrl: string;
  heroImageMission: string;
  heroImageVision: string;
  heroImageGallery: string;
  heroImageContact: string;
};

const defaultSettings: Settings = {
  email: 'serviceteamatm@gmail.com',
  phone: '+414028597',
  location: '96, Route de la Louvière\nGeneva\n1203 Switzerland',
  logoUrl: '',
  heroImageMission: '',
  heroImageVision: '',
  heroImageGallery: '',
  heroImageContact: '',
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('imrcSettings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('imrcSettings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
