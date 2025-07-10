import { FormControl, FormControlError, FormControlErrorText, FormControlErrorIcon } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface AddTodoFormProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  style: StyleProp<ViewStyle>;
}

export const AddTodoForm = ({ value, onChange, error, placeholder, style }: AddTodoFormProps) => {
  const flattenStyle = Array.isArray(style) ? Object.assign({}, ...style) : style || {};
  return (
    <FormControl isInvalid={!!error} isRequired size="lg" className="mt-8">
      <Input
        className="my-1 rounded-xl px-4"
        style={{
          backgroundColor: Colors.light.surface,
          ...flattenStyle,
        }}
      >
        <InputField type="text" placeholder={placeholder} value={value} onChangeText={onChange} className="text-xl border-b-[1px] border-b-slate-300" />
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
