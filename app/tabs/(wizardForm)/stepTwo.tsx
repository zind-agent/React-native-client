import React, { useEffect, useState } from 'react';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/Themed';
import HeaderTitle from '@/components/shared/headerTitle';
import WizardStepper from '@/components/shared/wizardSteper';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { GoalEnumItems } from '@/constants/GoalEnumItems';
import { useWizardStore } from '@/store/wizardFormState';
import { t } from 'i18next';
import { Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { ZindCheckbox } from '@/components/shared/checkBox';
import { router } from 'expo-router';

const StepTwo = () => {
  const { setStep } = useWizardStore();
  const { setGoal, goal } = useWizardStore();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(goal ?? []);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const toggleGoal = (key: string) => {
    setSelectedGoals((prevGoals) => {
      if (prevGoals.includes(key)) {
        return prevGoals.filter((item) => item !== key);
      } else {
        return [...prevGoals, key];
      }
    });
  };

  useEffect(() => {
    if (selectedGoals.length > 0) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [selectedGoals]);

  useEffect(() => {
    setStep(2);
  }, []);

  const onSubmit = () => {
    setGoal(selectedGoals);
    router.push('/tabs/(wizardForm)/stepThree');
  };
  const isCheckHandler = (key: string) => {
    toggleGoal(key);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 10, paddingHorizontal: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Box>
          <WizardStepper />
          <HeaderTitle title={t('your_goal')} path={'../(wizardForm)/stepThree'} />
          <Heading size="xl" className="px-3 mt-4" style={{ color: Colors.main.textPrimary }}>
            {t('what_do_you_want_from_zind')}
          </Heading>
          <Text className="px-3" style={{ color: Colors.main.textPrimary }}>
            {t('main_goal_guidance_text')}
          </Text>

          <VStack space="xl" className="mt-10">
            {GoalEnumItems.map((item) => (
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
                  backgroundColor: selectedGoals.includes(item.key) ? Colors.main.primary + '20' : Colors.main.background,
                }}
              >
                <ZindCheckbox checked={selectedGoals.includes(item.key)} onPress={isCheckHandler.bind(null, item.key)} />
                <Text style={{ fontSize: 14, color: Colors.main.textPrimary }}>{t(item.label)}</Text>
              </Pressable>
            ))}
          </VStack>
        </Box>
      </ScrollView>

      <Box style={{ position: 'absolute', bottom: 20, left: 16, right: 16 }}>
        <Button
          className="rounded-xl h-[50px]"
          style={{
            backgroundColor: isButtonDisabled ? Colors.main.primaryLight : Colors.main.primary,
            borderWidth: 1,
            borderColor: Colors.main.primaryLight,
          }}
          onPress={onSubmit}
          disabled={isButtonDisabled}
        >
          <ButtonText>{t('continue_step')}</ButtonText>
        </Button>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default StepTwo;
