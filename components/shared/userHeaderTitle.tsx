import React, { memo } from 'react';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { useWizardStore } from '@/store/wizardFormState';
import { t } from 'i18next';
import { Heading } from '../ui/heading';
import { Colors } from '@/constants/Colors';
import { Text } from '../Themed';
import { Image } from 'react-native';
import { Box } from '../ui/box';
import { LinearGradient } from 'expo-linear-gradient';

const capitalizeWords = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const UserHeaderTitle = memo(() => {
  const { firstname, lastname } = useWizardStore();
  return (
    <HStack className="mt-5 justify-between items-center">
      <VStack>
        <Heading className="text-lg font-bold" size="xl" style={{ color: Colors.light.darkBlue }}>
          {t('hi')}, {capitalizeWords(firstname || t('welcome_to_zind'))} {capitalizeWords(lastname) ?? ''}
        </Heading>
        <Text style={{ color: Colors.light.subtext }}>{t('home.lets_make_this_day_productive')}</Text>
      </VStack>

      <LinearGradient
        colors={['#a855f7', '#06b6d4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 90,
          height: 90,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          style={{
            borderRadius: 45,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            source={require('@/assets/images/personIcons.png')}
            style={{
              width: 75,
              height: 75,
              borderRadius: 40,
            }}
          />
        </Box>
      </LinearGradient>
    </HStack>
  );
});

export default UserHeaderTitle;
