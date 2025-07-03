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
import { useWizardStore } from '@/store/wizardFormState';

const HeaderTitle = ({ title, path }: { title: string; path: RelativePathString }) => {
  const { language } = useAppStore();
  const { step, setField } = useWizardStore();
  const backStep = () => {
    if (step !== 1) setField('step', String(step - 1));
    router.push(path);
  };
  return (
    <HStack className="items-center gap-4 mt-5">
      <Button
        className="rounded-xl h-[44px] w-[44px]"
        onPress={backStep}
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
          <BackIcon color={Colors.light.surface} />
        </Box>
      </Button>
      <Heading style={{ color: Colors.light.darkBlue }} className="font-ibmpBold" size="3xl">
        {title}
      </Heading>
    </HStack>
  );
};

export default HeaderTitle;
