import React from 'react';
import { Heading } from '../ui/heading';
import { Colors } from '@/constants/Colors';
import { Button } from '../ui/button';
import { HStack } from '../ui/hstack';
import { RelativePathString, router } from 'expo-router';
import BackIcon from '@/assets/Icons/Back';
import { Platform } from 'react-native';
import { useAppStore } from '@/store/appState';
import { Box } from '../ui/box';

const HeaderTitle = ({ title, path }: { title: string; path: RelativePathString }) => {
  const { language } = useAppStore();
  return (
    <HStack className="items-center gap-4 mt-5">
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
          <BackIcon color={Colors.main.background} />
        </Box>
      </Button>
      <Heading style={{ color: Colors.main10275A }} className="font-ibmpBold" size="3xl">
        {title}
      </Heading>
    </HStack>
  );
};

export default HeaderTitle;
