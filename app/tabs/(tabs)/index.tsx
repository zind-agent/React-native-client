import { Button } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const removeItem = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('lang');
    const lang = await AsyncStorage.getItem('lang');
    if (!lang) {
      router.replace('/language');
    }
  };

  return (
    <Center className="flex-1">
      <Heading>{t('home')}</Heading>
      <Text className="text-xl">{t('welcome to home')}</Text>
      <Button onPress={removeItem}>
        <Text>{t('clear storage')}</Text>
      </Button>
    </Center>
  );
}
