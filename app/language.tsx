import { Text, View } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Heading } from '@/components/ui/heading';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { MotiView } from 'moti';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

const Language = () => {
  const [selectedLang, setSelectedLang] = useState<'en' | 'fa'>('en');
  const { i18n } = useTranslation();

  const selectLanguage = async () => {
    const isRTL = selectedLang === 'fa';

    await AsyncStorage.setItem('lang', selectedLang);
    await i18n.changeLanguage(selectedLang);

    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
    }
    if (Updates.reloadAsync) {
      await Updates.reloadAsync();
    }
  };

  return (
    <View className="gap-10" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Box className="flex items-center justify-center">
        <Heading className="text-2xl font-roboto center">Select Languages</Heading>
        <Text>Choose your preferred language to continue</Text>
      </Box>
      <Box className="flex items-center justify-center gap-3 px-10 w-full">
        {['en', 'fa'].map((lang) => {
          const isSelected = selectedLang === lang;
          return (
            <MotiView
              key={lang}
              from={{ backgroundColor: Colors.main.primary }}
              animate={{ backgroundColor: isSelected ? Colors.main.primary : Colors.main.primaryLight }}
              transition={{ type: 'timing', duration: 100 }}
              className="rounded-xl"
            >
              <Button
                variant="solid"
                onPress={() => setSelectedLang(lang as 'en' | 'fa')}
                className="w-full h-[50] rounded-xl flex items-center justify-center transition-all"
                style={{ backgroundColor: 'transparent' }}
              >
                <ButtonText className="text-center w-full">{lang === 'en' ? 'English' : 'فارسی'}</ButtonText>
              </Button>
            </MotiView>
          );
        })}
      </Box>
      <Button variant="link" onPress={selectLanguage}>
        <Text
          style={{
            color: Colors.main.primary,
            borderBottomColor: Colors.main.primary,
            borderBottomWidth: 1,
            fontSize: 16,
          }}
        >
          Continue
        </Text>
      </Button>
    </View>
  );
};

export default Language;
