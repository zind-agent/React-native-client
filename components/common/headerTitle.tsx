import React from 'react';
import { Colors } from '@/constants/Colors';
import { RelativePathString, router } from 'expo-router';
import BackIcon from '@/assets/Icons/Back';
import { Platform } from 'react-native';
import { useAppStore } from '@/store/appState';
import { HStack } from '../ui/hstack';
import { Button } from '../ui/button';
import { Box } from '../ui/box';
import { Heading } from '../ui/heading';

const HeaderTitle = ({ title, path, isLight = false }: { title: string; path: RelativePathString; isLight?: boolean }) => {
  const { language } = useAppStore();
  return (
    <HStack className="items-center gap-4 mt-5 fixed top-0">
      <Button
        className="rounded-xl h-[44px] w-[44px]"
        onPress={() => router.push(path)}
        style={{
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            },
            android: {
              elevation: 3,
            },
          }),
        }}
      >
        <Box
          style={{
            transform: [{ rotate: language === 'fa' ? '180deg' : '0deg' }],
          }}
        >
          <BackIcon color={Colors.main.textPrimary} />
        </Box>
      </Button>
      <Heading style={{ color: isLight ? Colors.main.background : Colors.main.textPrimary }} className="font-ibmpBold" size="2xl">
        {title}
      </Heading>
    </HStack>
  );
};

export default HeaderTitle;
