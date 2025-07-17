import { Drawer, DrawerBackdrop, DrawerContent, DrawerBody, DrawerHeader } from '@/components/ui/drawer';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { AddTodoForm } from './addTodoTitle';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Switch } from '@/components/ui/switch';
import { useTodoStore } from '@/store/todoState';
import Loading from '../Loading';
import { TimePicker } from '../timePicker';
import SelectedTags from '../selectedTags';
import TimeDeffrence from '../timeDeffrence';
import DatePicker from '../datePicker';
import { Heading } from '@/components/ui/heading';
import { KeyboardAvoidingView, Platform } from 'react-native';

const addTodoSchema = z
  .object({
    id: z.string(),
    title: z.string().min(1, { message: t('append_title_required') }),
    tags: z.array(z.string()),
    start_time: z.string().min(1, { message: t('append_time_required') }),
    end_time: z.string().min(1, { message: t('append_time_required') }),
    date: z.string().min(1, { message: t('append_date_required') }),
    is_completed: z.boolean(),
    createdAt: z.string(),
    is_cancel: z.boolean(),
  })
  .refine(
    (data) => {
      const parseTime = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };
      const start = parseTime(data.start_time);
      const end = parseTime(data.end_time);
      return end > start;
    },
    {
      message: t('end_time_must_be_after_start_time'),
      path: ['end_time'],
    },
  );

type AddTodoSchemaType = z.infer<typeof addTodoSchema>;

interface AddTodoInTimeProps {
  date: string;
  id?: number;
}

const AddTodoInTime = memo(({ date, id }: AddTodoInTimeProps) => {
  const { addInTimeTodoDrawer, setAddInTimeTodoDrawer } = useAppStore();
  const { addTodo, updateTodo, todos, loading } = useTodoStore();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const todo = id ? todos.find((t) => t.id === id.toString()) : undefined;
  const isEditMode = !!todo;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<AddTodoSchemaType>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: isEditMode
      ? {
          id: todo.id,
          title: todo.title,
          tags: todo.tags,
          start_time: todo.start_time,
          end_time: todo.end_time,
          date: todo.date,
          is_completed: todo.isCompleted,
          createdAt: todo.createdAt,
          is_cancel: todo.isCancel,
        }
      : {
          id: Date.now().toString(),
          title: '',
          tags: [],
          start_time: new Date().toLocaleTimeString(),
          end_time: new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString(),
          is_completed: false,
          date: date,
          createdAt: new Date().toISOString(),
          is_cancel: false,
        },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (isEditMode && todo) {
      reset({
        id: todo.id,
        title: todo.title,
        tags: todo.tags,
        start_time: todo.start_time,
        end_time: todo.end_time,
        date: todo.date,
        is_completed: todo.isCompleted,
        createdAt: todo.createdAt,
        is_cancel: todo.isCancel,
      });
    } else if (!isEditMode) {
      reset({
        id: Date.now().toString(),
        title: '',
        tags: [],
        start_time: '',
        end_time: '',
        is_completed: false,
        date: date,
        createdAt: new Date().toISOString(),
        is_cancel: false,
      });
    }
  }, [date, isEditMode, todo, reset]);

  const startTime = watch('start_time');
  const endTime = watch('end_time');
  const isCancel = watch('is_cancel');

  const onSubmit = useCallback(
    (data: AddTodoSchemaType) => {
      const todoData = {
        id: isEditMode ? todo.id : Date.now().toString(),
        title: data.title,
        tags: data.tags,
        start_time: data.start_time,
        end_time: data.end_time,
        date: data.date,
        isCompleted: data.is_completed,
        createdAt: isEditMode ? todo.createdAt : new Date().toISOString(),
        isCancel: data.is_cancel,
      };

      const action = isEditMode ? updateTodo(todoData) : addTodo(todoData);

      action.then(() => {
        reset();
        setAddInTimeTodoDrawer(false);
      });
    },
    [isEditMode, todo, updateTodo, addTodo, reset, setAddInTimeTodoDrawer],
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <Drawer isOpen={addInTimeTodoDrawer} onClose={() => setAddInTimeTodoDrawer(false)} size="sm" anchor="bottom" className="bg-black/30">
      <DrawerBackdrop />
      <DrawerContent style={{ backgroundColor: Colors.main.background }} className="h-max rounded-t-[30px] border-t-0">
        <DrawerHeader className="flex justify-center items-center">
          <Heading style={{ color: Colors.main.primaryDark }}>{t('create_event')}</Heading>
        </DrawerHeader>
        <DrawerBody>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 10}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <AddTodoForm style={[{ height: 50 }, { borderColor: Colors.main.primaryLight }]} value={field.value} placeholder={t('title')} onChange={field.onChange} error={errors.title?.message} />
              )}
            />

            <VStack className="my-4 gap-5 p-1">
              <Controller name="date" control={control} render={({ field }) => <DatePicker field={field} setShowDatePicker={setShowDatePicker} showDatePicker={showDatePicker} />} />

              <HStack className="justify-center items-center gap-2 w-full">
                <Box style={{ alignItems: 'center' }}>
                  <Controller name="start_time" control={control} render={({ field }) => <TimePicker field={field} label={t('todos.start_time')} placeholder="00:00" width="[80%]" height="14" />} />
                </Box>

                <Box style={{ alignItems: 'center' }}>
                  <Controller name="end_time" control={control} render={({ field }) => <TimePicker field={field} label={t('todos.end_time')} placeholder="00:00" width="[80%]" height="14" />} />
                </Box>
              </HStack>

              {startTime && endTime && <TimeDeffrence startTime={startTime} endTime={endTime} />}
            </VStack>

            <Controller
              name="tags"
              control={control}
              render={({ field }) => {
                return <SelectedTags field={field} />;
              }}
            />

            <Controller
              name="is_completed"
              control={control}
              render={({ field }) => (
                <HStack className="flex items-center justify-between my-3 px-3">
                  <Text style={{ color: Colors.main.textPrimary, fontSize: 16, fontWeight: '800' }}>{t('todos.is_completed')}</Text>
                  <Switch
                    size="lg"
                    isDisabled={isCancel}
                    trackColor={{
                      false: Colors.main.primaryLight,
                      true: Colors.main.primary,
                    }}
                    thumbColor={field.value ? Colors.main.primary : Colors.main.primaryLight}
                    ios_backgroundColor={Colors.main.primaryLight}
                    onValueChange={field.onChange}
                    value={field.value}
                  />
                </HStack>
              )}
            />

            <Box style={{ display: isCancel ? 'flex' : 'none' }}>
              <Controller
                name="is_cancel"
                control={control}
                render={({ field }) => (
                  <HStack className="flex items-center justify-between mt-3 px-4">
                    <Text style={{ color: Colors.main.textPrimary, fontSize: 16, fontWeight: '800' }}>{t('todos.is_cancel')}</Text>
                    <Switch
                      size="lg"
                      trackColor={{
                        false: Colors.main.primaryLight,
                        true: Colors.main.primary,
                      }}
                      thumbColor={field.value ? Colors.main.primary : Colors.main.primaryLight}
                      ios_backgroundColor={Colors.main.primaryLight}
                      onValueChange={field.onChange}
                      value={field.value}
                    />
                  </HStack>
                )}
              />
            </Box>

            <Button onPress={handleSubmit(onSubmit)} className="w-full h-14 rounded-lg" style={{ backgroundColor: Colors.main.primary }}>
              <ButtonText className="text-xl" style={{ color: Colors.main.background, fontWeight: '800' }}>
                {isEditMode ? t('todos.update') : t('submit')}
              </ButtonText>
            </Button>
          </KeyboardAvoidingView>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
});

export default AddTodoInTime;
