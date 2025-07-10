import { Drawer, DrawerBackdrop, DrawerContent, DrawerHeader, DrawerBody } from '@/components/ui/drawer';
import { Heading } from '@/components/ui/heading';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import React, { memo, useEffect, useMemo } from 'react';
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

const addTodoSchema = z.object({
  title: z.string().min(1, { message: t('append_title_required') }),
  tags: z.array(z.string()),
  start_time: z.string().min(1, { message: t('append_time_required') }),
  end_time: z.string().min(1, { message: t('append_time_required') }),
  date: z.string().min(1, { message: t('append_date_required') }),
  is_completed: z.boolean(),
  id: z.string(),
  createdAt: z.string(),
});

type AddTodoSchemaType = z.infer<typeof addTodoSchema>;

const AddTodoInTime = memo(({ date }: { date: string }) => {
  const { addInTimeTodoDrawer, setAddInTimeTodoDrawer } = useAppStore();
  const { addTodo } = useTodoStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<AddTodoSchemaType>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: {
      id: Date.now().toString(),
      title: '',
      tags: [],
      start_time: '',
      end_time: '',
      is_completed: false,
      date: date,
      createdAt: new Date().toISOString(),
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    reset(() => ({
      date: date,
      start_time: '',
      end_time: '',
      is_completed: false,
      tags: [],
      title: '',
      createdAt: new Date().toISOString(),
      id: Date.now().toString(),
    }));
  }, [date, reset]);

  const startTime = watch('start_time');
  const endTime = watch('end_time');

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

  const onSubmit = (data: AddTodoSchemaType) => {
    addTodo({
      id: Date.now().toString(),
      title: data.title,
      tags: data.tags,
      start_time: data.start_time,
      end_time: data.end_time,
      date: data.date,
      completed: data.is_completed,
      createdAt: new Date().toISOString(),
    }).then(() => {
      reset();
      setAddInTimeTodoDrawer(false);
    });
  };

  return (
    <>
      <Button variant="solid" onPress={() => setAddInTimeTodoDrawer(true)} className="rounded-lg mx-10 mt-4">
        <HStack className="items-center" space="lg">
          <ButtonText className="text-md" style={{ color: Colors.light.light, fontWeight: 900 }}>
            + {t('todos.add_todo_in_time')}
          </ButtonText>
        </HStack>
      </Button>

      <Drawer isOpen={addInTimeTodoDrawer} onClose={() => setAddInTimeTodoDrawer(false)} size="lg" anchor="bottom" className="bg-black/60">
        <DrawerBackdrop />
        <DrawerContent style={{ backgroundColor: Colors.light.card }} className="h-max">
          <DrawerHeader className="justify-center py-1">
            <Heading style={{ color: Colors.light.darkBlue }}>{t('todos.add_todo_in_time')}</Heading>
          </DrawerHeader>

          <DrawerBody>
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400 }}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <AddTodoForm
                    style={[{ borderWidth: 1, height: 70 }, { borderColor: Colors.light.light }]}
                    value={field.value}
                    placeholder={t('title')}
                    onChange={field.onChange}
                    error={errors.title?.message}
                  />
                )}
              />
            </MotiView>

            <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 200 }}>
              <VStack className="mt-6 mb-4 gap-4">
                <HStack className="justify-center items-center gap-5">
                  <Box style={{ alignItems: 'center' }}>
                    <Controller
                      name="start_time"
                      control={control}
                      render={({ field }) => <TimePicker field={field} label={t('todos.start_time')} placeholder="00:00" rotateDirection="right" width={120} height={50} />}
                    />
                  </Box>

                  <MotiView from={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 300 }}>
                    <MotiView
                      animate={{
                        translateX: [0, 5, 0],
                      }}
                      transition={{
                        type: 'timing',
                        duration: 2000,
                        loop: true,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          color: Colors.light.primary,
                          marginTop: 20,
                        }}
                      >
                        →
                      </Text>
                    </MotiView>
                  </MotiView>

                  <Box style={{ alignItems: 'center' }}>
                    <Controller
                      name="end_time"
                      control={control}
                      render={({ field }) => <TimePicker field={field} label={t('todos.end_time')} placeholder="00:00" rotateDirection="left" width={120} height={50} />}
                    />
                  </Box>
                </HStack>

                {timeDifference && (
                  <MotiView from={{ opacity: 0, translateY: 10, scale: 0.9 }} animate={{ opacity: 1, translateY: 0, scale: 1 }} transition={{ type: 'spring', damping: 15, stiffness: 200 }}>
                    <Box className="items-center">
                      <MotiView
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          type: 'timing',
                          duration: 2000,
                          loop: true,
                        }}
                      >
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
                      </MotiView>
                    </Box>
                  </MotiView>
                )}
              </VStack>
            </MotiView>

            <MotiView from={{ opacity: 0, translateY: 40 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 400 }}>
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
                      <Text className="text-lg mx-3 mt-6 mb-3" style={{ color: Colors.light.darkBlue }}>
                        {t('tags')}
                      </Text>
                      <HStack className="justify-start items-center gap-2 mb-4 px-2 flex-wrap">
                        {tags.map((tag, index) => {
                          const isSelected = selectedTags.includes(tag.value);
                          return (
                            <MotiView
                              key={tag.value}
                              from={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                type: 'spring',
                                damping: 15,
                                stiffness: 200,
                                delay: index * 50,
                              }}
                            >
                              <Button
                                style={{
                                  backgroundColor: isSelected ? tag.color || Colors.light.tag.homeOpacity : 'transparent',
                                  borderWidth: 1,
                                  borderColor: tag.color || Colors.light.tag.homeOpacity,
                                }}
                                className="h-10 px-4 rounded-xl"
                                onPress={() => toggleTag(tag.value)}
                              >
                                <MotiView
                                  animate={{
                                    scale: isSelected ? 1.05 : 1,
                                  }}
                                  transition={{ type: 'timing', duration: 150 }}
                                >
                                  <ButtonText
                                    style={{
                                      color: isSelected ? 'white' : tag.color || Colors.light.tag.homeOpacity,
                                    }}
                                  >
                                    {tag.label}
                                  </ButtonText>
                                </MotiView>
                              </Button>
                            </MotiView>
                          );
                        })}
                      </HStack>
                    </Box>
                  );
                }}
              />
            </MotiView>

            <MotiView from={{ opacity: 0, translateY: 90 }} animate={{ opacity: 1, translateY: -10 }} transition={{ type: 'timing', duration: 400, delay: 400 }} className="mx-5">
              <Controller
                name="is_completed"
                control={control}
                render={({ field }) => (
                  <HStack className="flex items-center justify-between mt-3">
                    <Text style={{ color: Colors.light.darkBlue, fontSize: 16 }}>{t('todos.is_completed')}</Text>
                    <Switch
                      size="lg"
                      isDisabled={false}
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

            <MotiView from={{ opacity: 0, translateY: 50 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 600 }}>
              <Box className="mt-4 px-3 mb-4">
                <Button onPress={handleSubmit(onSubmit)} className="w-full h-10 rounded-xl" style={{ backgroundColor: Colors.light.primary }}>
                  <ButtonText style={{ color: Colors.light.surface }}>{t('submit')}</ButtonText>
                </Button>
              </Box>
            </MotiView>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
});

export default AddTodoInTime;
