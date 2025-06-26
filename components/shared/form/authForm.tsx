import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import React from 'react';
import MailIcon from '@/assets/Icons/Mail';

interface AuthFormProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const AuthForm = ({ value, onChange, error }: AuthFormProps) => {
  const { t } = useTranslation();

  return (
    <FormControl isInvalid={!!error} isRequired size="lg" className="mt-8">
      <Input
        className="my-1 h-16 rounded-xl px-4"
        style={{
          direction: 'rtl',
          backgroundColor: Colors.light.surface,
          borderWidth: 0,
          borderColor: 'transparent',
        }}
      >
        <MailIcon />
        <InputField
          type="text"
          placeholder={t('email placeholder')}
          value={value}
          onChangeText={onChange}
          className="text-xl"
        />
      </Input>

      {error && (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText style={{ color: Colors.light.accent }} className="text-sm">
            ** {error} **
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};
