import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/Themed';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { AddTodoSchemaType } from '@/components/schema/addTodoSchema';
import DaySelector from '@/components/common/daySelecter';

interface TodoAdvancedFieldsProps {
  control: Control<AddTodoSchemaType>;
}

export const TodoAdvancedFields: React.FC<TodoAdvancedFieldsProps> = ({ control }) => {
  return (
    <VStack className="gap-4">
      <Controller name="reminderDays" control={control} render={({ field }) => <DaySelector field={field} />} />
      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <VStack>
            <Text style={{ color: Colors.main.textPrimary }}>{t('description')}</Text>
            <Textarea
              className="my-1 w-full rounded-lg px-4 h-[80px]"
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
                placeholder={t('todos.write_description_todo')}
                className="h-10 items-start"
                style={{ textAlignVertical: 'top' }}
                placeholderTextColor={Colors.main.primaryLight}
              />
            </Textarea>
          </VStack>
        )}
      />
    </VStack>
  );
};
