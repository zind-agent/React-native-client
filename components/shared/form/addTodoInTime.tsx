import { Drawer, DrawerBackdrop, DrawerContent, DrawerHeader, DrawerBody } from '@/components/ui/drawer';
import { Heading } from '@/components/ui/heading';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { AddTodoForm } from './addTodoTitle';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { MotiView } from 'moti';
import { VStack } from '@/components/ui/vstack';
import { TimePicker } from '../timePicker/timePicker';
import { tags } from '@/constants/TodoAddTags';
import { Switch } from '@/components/ui/switch';
import { useTodoStore } from '@/store/todoState';
import DateTimePicker from '@react-native-community/datetimepicker';
import Loading from '../Loading';

const addTodoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: t('append_title_required') }),
  tags: z.array(z.string()),
  start_time: z.string().min(1, { message: t('append_time_required') }),
  end_time: z.string().min(1, { message: t('append_time_required') }),
  date: z.string().min(1, { message: t('append_date_required') }),
  is_completed: z.boolean(),
  createdAt: z.string(),
  is_cancel: z.boolean(),
});

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
          start_time: '',
          end_time: '',
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

  const timeDifference = useMemo(() => {
    if (!startTime || !endTime) return '';

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;

    let diffMin = endTotalMin - startTotalMin;

    if (diffMin < 0) {
      diffMin += 24 * 60;
    }

    const hours = Math.floor(diffMin / 60);
    const minutes = diffMin % 60;

    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  }, [startTime, endTime]);

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

  const formatDate = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Drawer isOpen={addInTimeTodoDrawer} onClose={() => setAddInTimeTodoDrawer(false)} size="lg" anchor="bottom" className="bg-black/60">
      <DrawerBackdrop />
      <DrawerContent style={{ backgroundColor: Colors.light.card }} className="h-max">
        <DrawerHeader className="justify-center py-1">
          <Heading style={{ color: Colors.light.darkBlue }}>{isEditMode ? t('todos.edit_todo') : t('todos.add_todo_in_time')}</Heading>
        </DrawerHeader>

        <DrawerBody>
          <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 300 }}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <AddTodoForm
                  style={[{ borderWidth: 1, height: 60 }, { borderColor: Colors.light.light }]}
                  value={field.value}
                  placeholder={t('title')}
                  onChange={field.onChange}
                  error={errors.title?.message}
                />
              )}
            />
          </MotiView>

          <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 300 }}>
            <VStack className="mt-6 mb-4 gap-5 rounded-lg p-7" style={{ backgroundColor: Colors.light.primary + '20' }}>
              <Text style={{ color: Colors.light.darkBlue, fontSize: 16, fontWeight: '800' }}>{t('todos.date')}</Text>
              <Box style={{ alignItems: 'center' }}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Button
                        onPress={() => setShowDatePicker(true)}
                        style={{
                          height: 50,
                          width: '100%',
                          backgroundColor: Colors.light.primary + '40',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <ButtonText style={{ color: Colors.light.primary, fontWeight: '800' }}>{field.value ? `${field.value} ` : t('todos.select_date')}</ButtonText>
                        <ButtonText style={{ color: Colors.light.primary, fontWeight: '800' }}>{new Date(field.value).toLocaleDateString('en-US', { weekday: 'long' })}</ButtonText>
                      </Button>
                      {showDatePicker && (
                        <DateTimePicker
                          value={field.value ? new Date(field.value) : new Date()}
                          mode="date"
                          display="default"
                          onChange={(_, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                              field.onChange(formatDate(selectedDate));
                            }
                          }}
                        />
                      )}
                      {errors.date && <Text style={{ color: Colors.light.accent, fontSize: 12, marginTop: 4 }}>{errors.date.message}</Text>}
                    </>
                  )}
                />
              </Box>

              <HStack className="justify-center items-center gap-5">
                <Box style={{ alignItems: 'center' }}>
                  <Controller
                    name="start_time"
                    control={control}
                    render={({ field }) => <TimePicker field={field} label={t('todos.start_time')} placeholder="00:00" rotateDirection="right" width={120} height={50} />}
                  />
                </Box>

                <Text
                  style={{
                    fontSize: 20,
                    color: Colors.light.primary,
                    marginTop: 20,
                  }}
                >
                  →
                </Text>

                <Box style={{ alignItems: 'center' }}>
                  <Controller
                    name="end_time"
                    control={control}
                    render={({ field }) => <TimePicker field={field} label={t('todos.end_time')} placeholder="00:00" rotateDirection="left" width={120} height={50} />}
                  />
                </Box>
              </HStack>

              {timeDifference && (
                <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 300 }}>
                  <Box className="items-center">
                    <Box
                      style={{
                        backgroundColor: Colors.light.primary + '15',
                        borderRadius: 20,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderWidth: 1,
                        borderColor: Colors.light.primary + '30',
                      }}
                    >
                      <Text className="text-sm font-medium" style={{ color: Colors.light.primary }}>
                        Duration: {timeDifference}
                      </Text>
                    </Box>
                  </Box>
                </MotiView>
              )}
            </VStack>
          </MotiView>

          <MotiView from={{ opacity: 0, translateY: 40 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 300 }}>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => {
                const selectedTags = field.value || [];

                const toggleTag = (tagValue: string) => {
                  if (selectedTags.includes(tagValue)) {
                    field.onChange(selectedTags.filter((v: string) => v !== tagValue));
                  } else {
                    field.onChange([...selectedTags, tagValue]);
                  }
                };

                return (
                  <Box>
                    <Text className="text-lg mx-3 mt-6 mb-3" style={{ color: Colors.light.darkBlue, fontWeight: '800' }}>
                      {t('tags')}
                    </Text>
                    <HStack className="justify-start items-center gap-2 mb-4 px-2 flex-wrap">
                      {tags.map((tag) => {
                        const isSelected = selectedTags.includes(tag.value);
                        return (
                          <Button
                            key={tag.value}
                            style={{
                              backgroundColor: isSelected ? tag.color || Colors.light.tag.homeOpacity : 'transparent',
                              borderWidth: 1,
                              borderColor: tag.color || Colors.light.tag.homeOpacity,
                            }}
                            className="h-10 px-4 rounded-xl"
                            onPress={() => toggleTag(tag.value)}
                          >
                            <ButtonText
                              style={{
                                color: isSelected ? 'white' : tag.color || Colors.light.tag.homeOpacity,
                              }}
                            >
                              {tag.label}
                            </ButtonText>
                          </Button>
                        );
                      })}
                    </HStack>
                  </Box>
                );
              }}
            />
          </MotiView>

          <MotiView from={{ opacity: 0, translateY: 90 }} animate={{ opacity: 1, translateY: -10 }} transition={{ type: 'timing', duration: 300 }} className="mx-5">
            <Controller
              name="is_completed"
              control={control}
              render={({ field }) => (
                <HStack className="flex items-center justify-between mt-3">
                  <Text style={{ color: Colors.light.darkBlue, fontSize: 16, fontWeight: '800' }}>{t('todos.is_completed')}</Text>
                  <Switch
                    size="lg"
                    isDisabled={isCancel}
                    trackColor={{
                      false: Colors.light.light,
                      true: Colors.light.primary,
                    }}
                    thumbColor={field.value ? Colors.light.primary : Colors.light.light}
                    ios_backgroundColor={Colors.light.light}
                    onValueChange={field.onChange}
                    value={field.value}
                  />
                </HStack>
              )}
            />
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 90 }}
            animate={{ opacity: 1, translateY: -10 }}
            transition={{ type: 'timing', duration: 300 }}
            className="mx-5"
            style={{ display: isCancel ? 'flex' : 'none' }}
          >
            <Controller
              name="is_cancel"
              control={control}
              render={({ field }) => (
                <HStack className="flex items-center justify-between mt-3">
                  <Text style={{ color: Colors.light.darkBlue, fontSize: 16, fontWeight: '800' }}>{t('todos.is_cancel')}</Text>
                  <Switch
                    size="lg"
                    trackColor={{
                      false: Colors.light.light,
                      true: Colors.light.primary,
                    }}
                    thumbColor={field.value ? Colors.light.primary : Colors.light.light}
                    ios_backgroundColor={Colors.light.light}
                    onValueChange={field.onChange}
                    value={field.value}
                  />
                </HStack>
              )}
            />
          </MotiView>

          <MotiView from={{ opacity: 0, translateY: 50 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 300 }}>
            <Box className="mt-4 px-3 mb-4">
              <Button onPress={handleSubmit(onSubmit)} className="w-full h-10 rounded-xl" style={{ backgroundColor: Colors.light.primary }}>
                <ButtonText style={{ color: Colors.light.surface }}>{isEditMode ? t('todos.update') : t('submit')}</ButtonText>
              </Button>
            </Box>
          </MotiView>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
});

export default AddTodoInTime;
