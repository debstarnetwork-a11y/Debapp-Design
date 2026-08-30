import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type TeamMember = {
  name: string;
  title: string;
  email: string | null;
  initials: string;
  image: string;
};

export type Settings = {
  email: string;
  phone: string;
  location: string;
  logoUrl: string;
  heroImageAbout: string;
  heroImageMission: string;
  heroImageVision: string;
  heroImageGallery: string;
  heroImageContact: string;
  imageLegacy: string;
  teamMembers: TeamMember[];
};

const defaultSettings: Settings = {
  email: 'serviceteamatm@gmail.com',
  phone: '+414028597',
  location: '96, Route de la Louvière\nGeneva\n1203 Switzerland',
  logoUrl: '',
  heroImageAbout: '',
  heroImageMission: '',
  heroImageVision: '',
  heroImageGallery: '',
  heroImageContact: '',
  imageLegacy: 'https://i.ibb.co/GfSmfpGV/Image-2.png',
  teamMembers: [
    {
      name: "Anita D. Benz",
      title: "Secretary for Emergency and Rehabilitation Fund",
      email: "serviceteamatm@gmail.com",
      initials: "AB",
      image: "https://i.ibb.co/5hK1jcC5/Anita-D-Benz.jpg"
    },
    {
      name: "Alfred Kammer",
      title: "Director of the Europe Department, International Monetary Cooperation",
      email: null,
      initials: "AK",
      image: "https://i.ibb.co/yBYb37DQ/Alfred-Karmer-01.jpg"
    },
    {
      name: "Kristalina Georgieva",
      title: "IMF Managing Director",
      email: null,
      initials: "KG",
      image: "https://i.ibb.co/twr6n85Z/Kristalina-Georgieva-01.jpg"
    }
  ]
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  loading: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 1)
          .single();

        if (data) {
          setSettings({
            email: data.email || defaultSettings.email,
            phone: data.phone || defaultSettings.phone,
            location: data.location || defaultSettings.location,
            logoUrl: data.logo_url || defaultSettings.logoUrl,
            heroImageAbout: data.hero_image_about || defaultSettings.heroImageAbout,
            heroImageContact: data.hero_image_contact || defaultSettings.heroImageContact,
            heroImageMission: data.hero_image_mission || defaultSettings.heroImageMission,
            heroImageVision: data.hero_image_vision || defaultSettings.heroImageVision,
            heroImageGallery: data.hero_image_gallery || defaultSettings.heroImageGallery,
            imageLegacy: data.image_legacy || defaultSettings.imageLegacy,
            teamMembers: data.team_members || defaultSettings.teamMembers,
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    try {
      // First, try updating with the new columns
      const { error } = await supabase
        .from('settings')
        .update({
          email: updated.email,
          phone: updated.phone,
          location: updated.location,
          logo_url: updated.logoUrl,
          hero_image_about: updated.heroImageAbout,
          hero_image_contact: updated.heroImageContact,
          hero_image_mission: updated.heroImageMission,
          hero_image_vision: updated.heroImageVision,
          hero_image_gallery: updated.heroImageGallery,
          image_legacy: updated.imageLegacy,
          team_members: updated.teamMembers,
        })
        .eq('id', 1);

      // If it fails because the columns don't exist yet, fallback to original columns
      if (error && error.message.includes('column')) {
        console.warn('Fallback: Saving without new columns. Please add team_members and image_legacy to your settings table.');
        await supabase
          .from('settings')
          .update({
            email: updated.email,
            phone: updated.phone,
            location: updated.location,
            logo_url: updated.logoUrl,
            hero_image_about: updated.heroImageAbout,
            hero_image_contact: updated.heroImageContact,
            hero_image_mission: updated.heroImageMission,
            hero_image_vision: updated.heroImageVision,
            hero_image_gallery: updated.heroImageGallery,
          })
          .eq('id', 1);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
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
