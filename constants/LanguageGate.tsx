import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '@/components/shared/Loading';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/appState';

export const LanguageGate = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [langSelected, setLangSelected] = useState<boolean | null>(null);
  const { setLanguage } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('lang').then((lang) => {
      if (lang) {
        setLangSelected(true);
        setLanguage(lang as 'fa' | 'en');
      } else {
        setLangSelected(false);
        router.replace('/language');
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return langSelected ? <>{children}</> : null;
};
