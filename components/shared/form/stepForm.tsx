import { FormControl, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { FieldError } from 'react-hook-form';
import { HStack } from '@/components/ui/hstack';

interface StepFormProps {
  value: string;
  onChange: (value: string) => void;
  error?: FieldError | undefined;
  placeholder?: string;
  title: string;
}

export const StepForm = ({ title, value, onChange, error, placeholder }: StepFormProps) => {
  return (
    <FormControl isInvalid={!!error} isRequired size="lg" className="mt-4">
      <HStack className="items-center">
        <FormControlLabelText className="px-3" style={{ color: Colors.light.darkBlue }}>
          {title}
        </FormControlLabelText>
      </HStack>
      <Input
        className="my-1 h-16 w-full rounded-xl px-4"
        style={{
          backgroundColor: Colors.light.surface,
          borderWidth: 1,
          borderColor: error != null ? Colors.light.accent : Colors.light.light,
        }}
      >
        <InputField
          type="text"
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          className="text-lg w-full"
          style={{ borderColor: Colors.light.light }}
          placeholderTextColor={Colors.light.light}
        />
      </Input>
    </FormControl>
  );
};
