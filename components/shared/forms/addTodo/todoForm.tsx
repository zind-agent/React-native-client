import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

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
    <FormControl isInvalid={!!error} isRequired size="lg" className="mt-8 p-5" style={styles.container}>
      <Box className="">
        <Text>{t('todos.title_form_todo')}</Text>
      </Box>
      <Input style={[styles.inputContainer, style]}>
        <InputField
          type="text"
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          className="text-xl text-slate-50"
          autoFocus={autoFocus}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 3,
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomColor: Colors.main.primaryLight,
    borderBottomWidth: 1,
  },
});
