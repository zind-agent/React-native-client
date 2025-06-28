import { FormControl } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';
import { Colors } from '@/constants/Colors';
import React, { useEffect, useState, useRef } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/Themed';
import { Button, ButtonText } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface CodeFormProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onResendCode?: () => void;
  length?: number;
}

export const CodeForm = ({ value, onChange, error, onResendCode, length = 4 }: CodeFormProps) => {
  const { t } = useTranslation();
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [otpValues, setOtpValues] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<any[]>(new Array(length).fill(null));

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    if (value && value.length <= length) {
      const newValues = new Array(length).fill('');
      for (let i = 0; i < value.length; i++) {
        newValues[i] = value[i] || '';
      }
      setOtpValues(newValues);
    }
  }, [value, length]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleResend = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(120);
      const emptyValues = new Array(length).fill('');
      setOtpValues(emptyValues);
      onChange('');
      inputRefs.current[0]?.focus();
      onResendCode?.();
    }
  };

  const handleInputChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);

    const newValues = [...otpValues];
    newValues[index] = digit;
    setOtpValues(newValues);

    const otpString = newValues.join('');
    onChange(otpString);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <FormControl isInvalid={!!error} isRequired size="lg" className="mt-8">
      <Box className="mt-4 items-center">
        <HStack className="w-full justify-between mb-3 px-2 items-center">
          <Text className="text-surface">{t('we send code')}</Text>

          {secondsLeft > 0 ? (
            <Text className="text-surface">{formatTime(secondsLeft)}</Text>
          ) : (
            <Button variant="link" onPress={handleResend}>
              <ButtonText>{t('resend code')}</ButtonText>
            </Button>
          )}
        </HStack>
      </Box>

      <HStack className="flex-row justify-between" style={{ direction: 'ltr' }}>
        {Array.from({ length }).map((_, index) => (
          <Input
            key={index}
            className="my-1 h-16 rounded-xl w-[22%]"
            style={{
              backgroundColor: Colors.light.surface,
              borderWidth: 1,
              borderColor: error ? Colors.light.accent : otpValues[index] ? Colors.light.primary : Colors.light.light,
            }}
          >
            <InputField
              ref={(ref: any) => {
                inputRefs.current[index] = ref;
              }}
              type="text"
              value={otpValues[index]}
              onChangeText={(text) => handleInputChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              className="text-xl text-center"
              maxLength={1}
              keyboardType="numeric"
              selectTextOnFocus
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
            />
          </Input>
        ))}
      </HStack>

      {error && <Text className="text-red-500 text-sm mt-2 text-center">{error}</Text>}
    </FormControl>
  );
};
