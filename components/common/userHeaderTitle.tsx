import React, { memo } from 'react';
import { useWizardStore } from '@/store/wizardFormState';
import { t } from 'i18next';
import { Colors } from '@/constants/Colors';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HStack } from '../ui/hstack';
import { Heading } from '../ui/heading';
import { VStack } from '../ui/vstack';
import { Text } from '../Themed';
import { Box } from '../ui/box';

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
        <Heading className="font-bold" size="lg" style={{ color: Colors.main.primaryDark }}>
          {t('home.hi')}, {capitalizeWords(firstname || t('home.welcome_to_cocheck'))} {capitalizeWords(lastname) ?? ''}
        </Heading>
        <Text style={{ color: Colors.main.textSecondary }}>{t('home.lets_make_this_day_productive')}</Text>
      </VStack>

      <LinearGradient
        colors={['#a855f7', '#06b6d4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 80,
          height: 80,
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
              width: 65,
              height: 65,
              borderRadius: 40,
            }}
          />
        </Box>
      </LinearGradient>
    </HStack>
  );
});

export default UserHeaderTitle;
