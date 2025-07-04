import WizardStepper from '@/components/shared/wizardSteper';
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
    try {
      await AsyncStorage.removeItem('lang');
      await AsyncStorage.removeItem('wizard-store');
      router.replace('/language');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  return (
    <Center className="flex-1">
      <WizardStepper />

      <Heading>{t('home')}</Heading>
      <Button onPress={removeItem}>
        <Text>{t('clear storage')}</Text>
      </Button>
    </Center>
  );
}
