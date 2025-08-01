import { Text, View } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { MotiView } from 'moti';
import { I18nManager, Image, TouchableOpacity } from 'react-native';
import * as Updates from 'expo-updates';
import getStartImage from '../assets/images/getStart.png';
import { Input, InputField } from '@/components/ui/input';
import { useAppStore } from '@/store/appState';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';

const Language = () => {
  const [selectedLang, setSelectedLang] = useState<'en' | 'fa'>('en');
  const [username, setUsername] = useState('');
  const { i18n } = useTranslation();
  const { setUserAndLanguage, user } = useAppStore();

  const selectLanguage = async () => {
    const isRTL = selectedLang === 'fa';

    await AsyncStorage.setItem('lang', selectedLang);

    await i18n.changeLanguage(selectedLang);

    if (!user?.id) setUserAndLanguage(username, selectedLang);

    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
    }

    if (Updates.reloadAsync) {
      await Updates.reloadAsync();
    }
    if (user?.id && user?.language && user?.username) {
      router.push('/');
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  ];

  return (
    <View
      className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100"
      style={{
        flex: 1,
        backgroundColor: Colors.main.background,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
      }}
    >
      {/* Header Section */}
      <MotiView from={{ opacity: 0, translateY: -50 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 800, delay: 200 }} className="items-center mb-8">
        <Text className="text-3xl font-bold text-center mb-2" style={{ color: Colors.main.textPrimary, marginBottom: 8 }}>
          Welcome!
        </Text>
        <Text className="text-base text-center opacity-70" style={{ color: Colors.main.textSecondary }}>
          Choose your language and create your profile
        </Text>
      </MotiView>

      <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 1000, delay: 400 }} className="items-center mb-12">
        <Image source={getStartImage} className="h-80 w-80" />
      </MotiView>

      <MotiView from={{ opacity: 0, translateY: 50 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600, delay: 600 }} className="flex-1 justify-center">
        <Box>
          <View className="mb-7">
            <Text className="mb-2 px-3" style={{ color: Colors.main.textPrimary }}>
              Username
            </Text>
            <Input
              className="h-16 rounded-2xl border-2"
              style={{
                borderColor: username ? Colors.main.primary : Colors.main.border,
                backgroundColor: Colors.main.cardBackground,
              }}
            >
              <InputField
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                autoFocus
                placeholderTextColor={Colors.main.textSecondary}
                className="text-base"
                style={{ color: Colors.main.textPrimary }}
              />
            </Input>
          </View>

          <View className="mb-4">
            <Text className="px-3 mb-3" style={{ color: Colors.main.textPrimary }}>
              Select Language
            </Text>
            <View className="gap-3">
              {languages.map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <MotiView key={lang.code} from={{ scale: 1 }} transition={{ type: 'spring', duration: 200 }}>
                    <TouchableOpacity
                      onPress={() => setSelectedLang(lang.code as 'en' | 'fa')}
                      className="rounded-2xl p-2 px-4 border-2 flex-row items-center justify-between"
                      style={{
                        backgroundColor: isSelected ? Colors.main.primary + '15' : 'transparent',
                        borderColor: isSelected ? Colors.main.primary : Colors.main.border,
                      }}
                    >
                      <VStack className="flex-row items-center gap-3 ">
                        <Text className="text-2xl">{lang.flag}</Text>
                        <Text className="text-lg">{lang.name}</Text>
                      </VStack>

                      <View
                        className="w-6 h-6 rounded-full border-2 items-center justify-center"
                        style={{
                          borderColor: isSelected ? Colors.main.primary : Colors.main.border,
                        }}
                      >
                        {isSelected && (
                          <MotiView
                            from={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 300 }}
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: Colors.main.primary }}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  </MotiView>
                );
              })}
            </View>
          </View>
        </Box>

        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 800 }}>
          <TouchableOpacity
            onPress={selectLanguage}
            disabled={!username.trim()}
            className="rounded-2xl p-4 items-center shadow-lg"
            style={{
              backgroundColor: username.trim() ? Colors.main.primary : Colors.main.textSecondary,
              shadowColor: Colors.main.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: username.trim() ? 0.3 : 0,
              shadowRadius: 10,
              elevation: username.trim() ? 5 : 0,
              opacity: username.trim() ? 1 : 0.6,
            }}
          >
            <Text className="text-lg" style={{ color: Colors.main.textPrimary }}>
              Continue
            </Text>
          </TouchableOpacity>
        </MotiView>
      </MotiView>
    </View>
  );
};

export default Language;
