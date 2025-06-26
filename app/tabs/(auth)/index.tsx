import BackIcon from '@/assets/Icons/Back';
import { AuthForm } from '@/components/shared/form/authForm';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import SendIcon from '@/assets/Icons/Send';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import GoogleIcon from '@/assets/Icons/Google';
import MailIcon from '@/assets/Icons/Mail';

const AuthWithPhoneNumber = () => {
  const { t } = useTranslation();
  const { language } = useAppStore();

  const authSchema = z.object({
    email: z
      .string()
      .email({ message: t('email invalid') })
      .min(6),
  });

  type LoginFormValues = z.infer<typeof authSchema>;

  const { control, formState: { errors, isValid } } = useForm<LoginFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '' },
    mode: 'onSubmit',
  });


  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
  };


  return (
    <VStack className="flex-1 justify-between mb-5">
      <Box
        className="h-max rounded-b-[40] pb-10"
        style={{
          backgroundColor: Colors.light.primary,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
            android: {
              elevation: 4,
            },
          }),
        }}
      >

        {/*Back to  Home */}
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
            {t('login email')}
          </Heading>

          <Text style={{ color: Colors.light.surface }}>
            {t('Your privacy and security are our top priorities')}
          </Text>

          {/*auth Login Form  */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <AuthForm
                value={field.value}
                onChange={field.onChange}
                error={errors.email?.message}
              />
            )}
          />
        </Box>
      </Box>

      <VStack className="px-5">
        <Button
          isDisabled={!isValid}
          style={{ backgroundColor: Colors.light.primary }}
          className="h-16 rounded-xl"
          onPress={() => control.handleSubmit(onSubmit)()}
        >
          <ButtonIcon as={SendIcon} />
          <ButtonText className="text-white">{t('send code')}</ButtonText>
        </Button>

        <HStack className="justify-center items-center gap-5 my-5 px-5">
          <Box style={{ flex: 1, height: 1, backgroundColor: Colors.light.light }} />
          <Text className="text-white">{t('or')}</Text>
          <Box style={{ flex: 1, height: 1, backgroundColor: Colors.light.light }} />
        </HStack>

        <VStack className="gap-3">
          <Button style={{ backgroundColor: Colors.light.light }} className="h-16 rounded-xl flex justify-start px-20">
            <ButtonIcon as={GoogleIcon} />
            <ButtonText style={{ color: Colors.light.darkBlue }} className="font-heading">
              {t('continue with google')}
            </ButtonText>
          </Button>

          <Button style={{ backgroundColor: Colors.light.light }} className="h-16 rounded-xl flex justify-start px-20">
            <MailIcon color={Colors.light.darkBlue} />
            <ButtonText style={{ color: Colors.light.darkBlue }} className="font-heading">
              {t('continue with mobile')}
            </ButtonText>
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default AuthWithPhoneNumber;
