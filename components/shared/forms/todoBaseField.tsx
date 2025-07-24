import React, { Dispatch, SetStateAction } from 'react';
import { Controller, Control } from 'react-hook-form';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { AddTodoForm } from './addTodo/addTodoTitle';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { AddTodoSchemaType } from '@/components/schema/addTodoSchema';
import DatePicker from '@/components/common/datePicker';
import { TimePicker } from '@/components/common/timePicker';
import TimeDeffrence from '@/components/common/timeDeffrence';

interface TodoBasicFieldsProps {
  control: Control<AddTodoSchemaType>;
  errors: any;
  startTime: string;
  endTime: string;
  showDatePicker: boolean;
  setShowDatePicker: Dispatch<SetStateAction<boolean>>;
}

export const TodoBasicFields: React.FC<TodoBasicFieldsProps> = ({ control, errors, startTime, endTime, showDatePicker, setShowDatePicker }) => {
  return (
    <>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <AddTodoForm
            autoFocus
            style={{ height: 40, borderColor: Colors.main.primaryLight, marginBottom: 10, backgroundColor: 'transparent' }}
            value={field.value}
            placeholder={t('title')}
            onChange={field.onChange}
            error={errors.title?.message}
          />
        )}
      />

      <VStack className="gap-4 p-1">
        <Controller name="date" control={control} render={({ field }) => <DatePicker field={field} setShowDatePicker={setShowDatePicker} showDatePicker={showDatePicker} />} />

        <HStack className="justify-center items-center gap-2 w-full">
          <Box style={{ alignItems: 'center' }}>
            <Controller name="start_time" control={control} render={({ field }) => <TimePicker field={field} label={t('todos.start_time')} placeholder="00:00" width="[80%]" height="12" />} />
          </Box>

          <Box style={{ alignItems: 'center' }}>
            <Controller name="end_time" control={control} render={({ field }) => <TimePicker field={field} label={t('todos.end_time')} placeholder="00:00" width="[80%]" height="12" />} />
          </Box>
        </HStack>

        {startTime && endTime && <TimeDeffrence startTime={startTime} endTime={endTime} />}
      </VStack>
    </>
  );
};
