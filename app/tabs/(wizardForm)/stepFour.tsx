import React, { useEffect, useState } from 'react';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/Themed';
import HeaderTitle from '@/components/shared/headerTitle';
import WizardStepper from '@/components/shared/wizardSteper';
import { Colors } from '@/constants/Colors';
import { useWizardStore } from '@/store/wizardFormState';
import { t } from 'i18next';
import { OneQuestion, ThreeQuestion, TwoQuestion } from '@/constants/LifeStyleEnumItems';
import { Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { ZindCheckbox } from '@/components/shared/checkBox';
import { router } from 'expo-router';
import { useShowToast } from '@/components/shared/customToast';

const StepFour = () => {
  const { setStep, setField } = useWizardStore();
  const showToast = useShowToast();

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{
    questionOne?: string;
    questionTwo?: string;
    questionThree?: string;
  }>({});

  useEffect(() => {
    if (selectedOptions.questionOne && selectedOptions.questionTwo && selectedOptions.questionThree) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [selectedOptions]);

  useEffect(() => {
    setStep(4);
  }, []);

  const handleSelect = (question: 'questionOne' | 'questionTwo' | 'questionThree', key: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [question]: prev[question] === key ? undefined : key,
    }));
  };

  const onSubmit = () => {
    let hasError = false;
    const newErrorBox = { one: false, two: false, three: false };

    if (!selectedOptions.questionOne) {
      newErrorBox.one = true;
      hasError = true;
    }
    if (!selectedOptions.questionTwo) {
      newErrorBox.two = true;
      hasError = true;
    }
    if (!selectedOptions.questionThree) {
      newErrorBox.three = true;
      hasError = true;
    }

    if (!hasError) {
      setField('sleepTime', selectedOptions.questionOne || '');
      setField('extersize', selectedOptions.questionTwo || '');
      setField('stressedFeeling', selectedOptions.questionThree || '');
      router.push('/tabs/(wizardForm)/stepTwo');
    } else {
      showToast(t('ass_questions'), 'error');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Box>
          <WizardStepper />
          <HeaderTitle title={t('lifestyle.your_current_lifestyle')} path={'../(wizardForm)/stepTwo'} />
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
          <ButtonText>{t('continue_step')}</ButtonText>
        </Button>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default StepFour;
