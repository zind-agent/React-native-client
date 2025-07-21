import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface AddTodoFormProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  style: StyleProp<ViewStyle>;
  autoFocus?: boolean;
}

export const AddTodoForm = ({ value, onChange, error, placeholder, style, autoFocus }: AddTodoFormProps) => {
  return (
    <FormControl isInvalid={!!error} isRequired size="lg" className="mt-8">
      <Input className="rounded-xl px-4" style={[{ backgroundColor: Colors.main.background, borderWidth: 0, borderBottomWidth: 1 }, style]}>
        <InputField
          type="text"
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          className="text-xl"
          autoFocus={autoFocus}
          style={{ color: Colors.main.textPrimary }}
          placeholderTextColor={Colors.main.textSecondary}
        />
      </Input>

      {error && (
        <FormControlError>
          <FormControlErrorText style={{ color: Colors.main.accent }} className="text-sm">
            {error}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};
