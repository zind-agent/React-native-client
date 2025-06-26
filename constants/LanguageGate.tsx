import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '@/components/shared/Loading';
import Language from '@/app/language';

const LanguageGate = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [langSelected, setLangSelected] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('lang').then(lang => {
      setLangSelected(!!lang);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return langSelected ? <>{children}</> : <Language />;
};
