import React, { useEffect, useState } from 'react';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/Themed';
import HeaderTitle from '@/components/shared/headerTitle';
import WizardStepper from '@/components/shared/wizardSteper';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { useWizardStore } from '@/store/wizardFormState';
import { t } from 'i18next';
import { Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { ZindCheckbox } from '@/components/shared/checkBox';
import { router } from 'expo-router';
import { PriorityEnumItems } from '@/constants/PriorityEnumItems';

const StepTwo = () => {
  const { setStep } = useWizardStore();
  const { topPriority, setTopPriority } = useWizardStore();
  const [selected, setSelected] = useState<string[]>(topPriority ?? []);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const togglePriority = (key: string) => {
    setSelected((prevGoals) => {
      if (prevGoals.includes(key)) {
        return prevGoals.filter((item) => item !== key);
      } else {
        return [...prevGoals, key];
      }
    });
  };

  useEffect(() => {
    if (selected.length > 0) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [selected]);

  useEffect(() => {
    setStep(4);
  }, []);

  const onSubmit = () => {
    setTopPriority(selected);
    router.push('/tabs/(tabs)');
  };

  const isCheckHandler = (key: string) => {
    togglePriority(key);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 10, paddingHorizontal: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Box>
          <WizardStepper />
          <HeaderTitle title={t('priorities.title')} path={'../(wizardForm)/stepOne'} />
          <Heading size="lg" className="px-2 mt-4" style={{ color: Colors.light.darkBlue }}>
            {t('priorities.subtitle')}
          </Heading>
          <Text className="px-3" style={{ color: Colors.light.subtext }}>
            {t('priorities.description')}
          </Text>

          <VStack space="lg" className="mt-10">
            {PriorityEnumItems.map((item) => (
              <Pressable
                key={item.key}
                onPress={isCheckHandler.bind(null, item.key)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: selected.includes(item.key) ? Colors.light.primary + '20' : Colors.light.surface,
                }}
              >
                <ZindCheckbox checked={selected.includes(item.key)} onPress={isCheckHandler.bind(null, item.key)} />
                <Text style={{ fontSize: 14, color: Colors.light.text }}>{t(item.label)}</Text>
              </Pressable>
            ))}
          </VStack>
        </Box>
      </ScrollView>

      <Box style={{ position: 'absolute', bottom: 20, left: 16, right: 16 }}>
        <Button
          className="rounded-xl h-[50px]"
          style={{
            backgroundColor: isButtonDisabled ? Colors.light.light : Colors.light.primary,
            borderWidth: 1,
            borderColor: Colors.light.light,
          }}
          onPress={onSubmit}
          disabled={isButtonDisabled}
        >
          <ButtonText>{t('button.zind_will_start_from_here')}</ButtonText>
        </Button>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default StepTwo;
