import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/appState';
import Loading from '@/components/shared/Loading';

export const LanguageGate = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const { setLanguage, setCalender } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    const checkLanguage = async () => {
      try {
        const lang = await AsyncStorage.getItem('lang');
        if (lang) {
          setLanguage(lang as 'fa' | 'en');
          setCalender(lang === 'fa' ? 'jalali' : 'gregorian');
        } else {
          setTimeout(() => router.push('/language'), 0);
        }
      } catch (error) {
        console.error('Error reading AsyncStorage:', error);
        setTimeout(() => router.push('/language'), 0);
      } finally {
        setLoading(false);
      }
    };
    checkLanguage();
  }, [router]);

  if (loading) return <Loading />;

  return <>{children}</>;
};
