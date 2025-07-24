import SelectStepGender from '@/components/shared/forms/selectStepGender';
import { StepForm } from '@/components/shared/forms/auth/stepForm';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { useWizardStore } from '@/store/wizardFormState';
import { WizardStateType } from '@/types/wizard-form-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { t } from 'i18next';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import WizardStepper from '@/components/common/wizardSteper';
import HeaderTitle from '@/components/common/headerTitle';

const stepOneSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string(),
  height: z.string().min(1),
  weight: z.string().min(1),
  age: z.string().min(1),
  gender: z.string(),
  description: z.string(),
});

type stepOneSchemaType = z.infer<typeof stepOneSchema>;
const StepOne = () => {
  const { lastname, setStep, firstname, gender, age, weight, height, descreption, setField } = useWizardStore();
  const { control, handleSubmit } = useForm<stepOneSchemaType>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      firstname: firstname ?? '',
      lastname: lastname ?? '',
      height: height > 0 ? String(height) : '',
      weight: weight > 0 ? String(weight) : '',
      age: age > 0 ? String(age) : '',
      gender: gender ?? '',
      description: descreption ?? '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    setStep(1);
  }, []);

  const onSubmit = (data: stepOneSchemaType) => {
    Object.entries(data).forEach(([key, value]) => {
      setField(key as keyof Omit<WizardStateType, 'setField'>, value);
    });
    setField('step', String(2));
    router.push('/tabs/(wizardForm)/stepTwo');
  };

  return (
    <Box className="flex-1 px-[14px]">
      <WizardStepper />
      <HeaderTitle title={t('base_information')} path={'../(wizardForm)'} />
      <Box>
        <Controller
          render={({ field, fieldState }) => <StepForm title={t('first_name')} value={field.value} onChange={field.onChange} error={fieldState.error} placeholder={t('first_name_placeholder')} />}
          name="firstname"
          control={control}
        />
        <Controller
          render={({ field, fieldState }) => <StepForm title={t('last_name')} value={field.value} onChange={field.onChange} error={fieldState.error} placeholder={t('last_name_placeholder')} />}
          name="lastname"
          control={control}
        />

        <HStack className="justify-center gap-5 px-3">
          <Box className="w-1/2">
            <Controller
              render={({ field, fieldState }) => <StepForm title={t('weight')} value={field.value} onChange={field.onChange} error={fieldState.error} placeholder={t('weight_placeholder')} />}
              name="weight"
              control={control}
            />
          </Box>
          <Box className="w-1/2">
            <Controller
              render={({ field, fieldState }) => <StepForm title={t('height')} value={field.value} onChange={field.onChange} error={fieldState.error} placeholder={t('height_placeholder')} />}
              name="height"
              control={control}
            />
          </Box>
        </HStack>
        <HStack className="justify-center gap-5 px-3">
          <Box className="w-1/2">
            <Controller
              render={({ field, fieldState }) => <StepForm title={t('age')} value={field.value} onChange={field.onChange} error={fieldState.error} placeholder={t('age_placeholder')} />}
              name="age"
              control={control}
            />
          </Box>

          <Box className="w-1/2">
            <Controller render={({ field }) => <SelectStepGender selectedValue={field.value} setSelectedValue={field.onChange} />} name="gender" control={control} />
          </Box>
        </HStack>
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <VStack>
              <Text style={{ color: Colors.main.textPrimary }} className="mt-5">
                {t('description')}
              </Text>
              <Textarea
                className="my-1 w-full rounded-xl px-4 h-[150px]"
                style={{
                  backgroundColor: Colors.main.background,
                  borderWidth: 1,
                  borderColor: Colors.main.primaryLight,
                }}
                size="sm"
                isReadOnly={false}
                isInvalid={!!fieldState.error}
                isDisabled={false}
              >
                <TextareaInput
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('write_description_placeholder')}
                  className="h-10 items-start"
                  style={{ textAlignVertical: 'top' }}
                  placeholderTextColor={Colors.main.primaryLight}
                />
              </Textarea>
            </VStack>
          )}
        />
      </Box>
      <Button
        className="rounded-xl h-[50px] mt-3"
        style={{
          backgroundColor: Colors.main.primary,
          borderWidth: 1,
          borderColor: Colors.main.primaryLight,
        }}
        onPress={handleSubmit(onSubmit)}
      >
        <ButtonText>{t('continue_step')}</ButtonText>
      </Button>
    </Box>
  );
};

export default StepOne;
