import BackIcon from '@/assets/Icons/Back';
import { AuthForm } from '@/components/shared/form/authForm';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import SendIcon from '@/assets/Icons/Send';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import GoogleIcon from '@/assets/Icons/Google';
import MailIcon from '@/assets/Icons/Mail';
import Loading from '@/components/shared/Loading';
import { CodeForm } from '@/components/shared/form/codeForm';
import { useShowToast } from '@/components/shared/customToast';
import { t } from 'i18next';

const emailSchema = z.object({
  identifier: z.string().min(1, { message: 'email required' }).email({ message: 'email invalid' }),
});

const phoneSchema = z.object({
  identifier: z.string().min(1, { message: 'phoneNumber required' }),
});

const codeSchema = z.object({
  code: z
    .string()
    .min(4, { message: 'code must be 4 digits' })
    .max(4, { message: 'code must be 4 digits' })
    .regex(/^\d{4}$/, { message: t('code_must_contain_only_numbers') }),
});

const schemas = {
  email: emailSchema,
  phone: phoneSchema,
} as const;

interface GenericAuthProps {
  authType: 'email' | 'phone';
}

const GenericAuth: React.FC<GenericAuthProps> = ({ authType }) => {
  const { language, sendMassage, sendOtp, isLoading, isSendCode, setIsSendCode } = useAppStore();
  const showToast = useShowToast();

  const authConfigs = {
    email: {
      type: 'email',
      title: t('login_email'),
      placeholder: t('email_placeholder'),
      alternativeText: t('continue_with_email'),
    },
    phone: {
      type: 'phone',
      title: t('login_mobile_number'),
      placeholder: t('mobile_placeholder'),
      alternativeText: t('continue_with_mobile'),
    },
  } as const;

  if (!authType) {
    return (
      <VStack className="flex-1 justify-center items-center">
        <Text>Error: authType not provided</Text>
      </VStack>
    );
  }

  const identifierSchema = schemas[authType];
  if (!identifierSchema) {
    console.error(`Schema not found for authType: ${authType}`);
    return (
      <VStack className="flex-1 justify-center items-center">
        <Text>Error: Invalid authType: {authType}</Text>
      </VStack>
    );
  }

  const config = authConfigs[authType];
  const combinedSchema = identifierSchema.merge(codeSchema);
  const currentSchema = isSendCode ? combinedSchema : identifierSchema;

  type IdentifierFormValues = z.infer<typeof identifierSchema>;
  type CodeFormValues = z.infer<typeof combinedSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<IdentifierFormValues | CodeFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: { identifier: '', code: '' },
    mode: 'onChange',
  });

  const identifierValue = watch('identifier');
  const codeValue = watch('code');

  const verifyCode = useCallback(
    async (identifier: string, code: string) => {
      try {
        const result = await sendOtp(identifier, code);
        return result;
      } catch (error) {
        console.error('Verify code error:', error);
        return { success: false, message: t('something_went_wrong') };
      }
    },
    [sendOtp, t],
  );

  const onSubmit = async (data: IdentifierFormValues | CodeFormValues) => {
    try {
      if (!isSendCode) {
        const result = await sendMassage(data.identifier);

        if (result.success) {
          showToast(t('code_sent_successfully'), 'success');
        } else {
          showToast(result.message || t('failed_to_send_code'), 'error');
        }
      } else {
        const result = await verifyCode(data.identifier, (data as CodeFormValues).code);
        if (result.success) {
          showToast(t('login_successful'), 'success');
          setIsSendCode(false);
          router.push('/tabs/profile');
        } else {
          showToast(result.message || t('invalid_code'), 'error');
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToast(t('something_went_wrong'), 'error');
    }
  };

  const handleResendCode = useCallback(async () => {
    try {
      if (identifierValue) {
        const result = await sendMassage(identifierValue);
        if (result.success) {
          showToast(t('code_sent_successfully'), 'success');
        } else {
          showToast(result.message || t('failed_to_resend_code'), 'error');
        }
      }
    } catch (error) {
      console.error('Resend code error:', error);
      showToast(t('failed_to_resend_code'), 'error');
    }
  }, [identifierValue, sendMassage, t, showToast]);

  const isIdentifierValid = identifierValue && identifierValue.length > 0 && !errors.identifier;
  const isCodeValid = !isSendCode || (codeValue && codeValue.length === 4 && !errors.root);
  const canSubmit = isIdentifierValid && isCodeValid && !isLoading;

  const handleNavigateToAlternative = useCallback(() => {
    const targetRoute = authType === 'email' ? '/tabs/(auth)/mobileAuth' : '/tabs/(auth)/emailAuth';
    router.push(targetRoute);
  }, [authType]);

  return (
    <VStack className="flex-1 justify-between mb-5">
      <Box
        className="h-max rounded-b-[40] pb-10"
        style={{
          backgroundColor: Colors.light.primary,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
            android: { elevation: 4 },
          }),
        }}
      >
        <Button
          className="w-[40px] h-[40px] rounded-xl shadow-button mt-10 mx-10"
          style={{
            backgroundColor: Colors.light.surface,
            transform: language === 'fa' ? [{ rotate: '180deg' }] : [],
          }}
          onPress={() => router.push('/tabs/profile')}
        >
          <BackIcon />
        </Button>

        <Box className="mt-[80px] mx-10">
          <Heading size="2xl" className="text-white">
            {t(config.title)}
          </Heading>
          <Text style={{ color: Colors.light.surface }}>{t('Your privacy and security are our top priorities')}</Text>

          <Controller
            name="identifier"
            control={control}
            render={({ field }) => (
              <AuthForm
                value={field.value}
                placeholder={t(config.placeholder)}
                onChange={(value) => {
                  field.onChange(value);
                  trigger('identifier');
                }}
                error={errors.identifier?.message}
              />
            )}
          />
        </Box>

        {isSendCode && (
          <Box className="w-[80%] mx-auto">
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <CodeForm
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    if (value.length === 4) {
                      trigger('code');
                    }
                  }}
                  error={errors.root?.message}
                  onResendCode={handleResendCode}
                />
              )}
            />
          </Box>
        )}
      </Box>

      <VStack className="px-5">
        <Button
          isDisabled={!canSubmit}
          style={{
            backgroundColor: canSubmit ? Colors.light.primary : Colors.light.light,
            opacity: canSubmit ? 1 : 0.8,
          }}
          className="h-16 rounded-xl mt-3"
          onPress={handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {!isSendCode && <ButtonIcon as={SendIcon} />}
              <ButtonText className="text-white text-xl">{!isSendCode ? t('send_code') : t('approve_code')}</ButtonText>
            </>
          )}
        </Button>

        <HStack className="justify-center items-center gap-5 my-5 px-5">
          <Box style={{ flex: 1, height: 1, backgroundColor: Colors.light.light }} />
          <Text className="text-primary">{t('or')}</Text>
          <Box style={{ flex: 1, height: 1, backgroundColor: Colors.light.light }} />
        </HStack>

        <VStack className="gap-3">
          <Button style={{ backgroundColor: Colors.light.light }} className="h-16 rounded-xl flex justify-center">
            <ButtonIcon as={GoogleIcon} />
            <ButtonText style={{ color: Colors.light.darkBlue }} className="font-heading">
              {t('continue with google')}
            </ButtonText>
          </Button>

          <Button style={{ backgroundColor: Colors.light.light }} className="h-16 rounded-xl flex justify-center" onPress={handleNavigateToAlternative}>
            <MailIcon color={Colors.light.darkBlue} />
            <ButtonText style={{ color: Colors.light.darkBlue }} className="font-heading">
              {t(config.alternativeText)}
            </ButtonText>
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default GenericAuth;
