import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useTodoStore } from '@/store/todoState';
import { addTodoSchema, AddTodoSchemaType } from '@/components/schema/addTodoSchema';
import { TaskStatus } from '@/constants/TaskEnum';
import { router } from 'expo-router';

export const useTodoForm = (selectedDate: string) => {
  const { createTask } = useTodoStore();

  const form = useForm<AddTodoSchemaType>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: {
      title: '',
      startTime: '',
      endTime: '',
      description: '',
      categoryId: '',
      goalId: '',
      date: selectedDate,
      createdAt: '',
      reminderDays: [],
    },
    mode: 'onSubmit',
  });

  const { reset } = form;

  useEffect(() => {
    const now = new Date();
    const endTime = new Date(now.getTime() + 10 * 60 * 1000);

    const formatTime = (date: Date): string => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    reset({
      title: '',
      startTime: formatTime(now),
      endTime: formatTime(endTime),
      description: '',
      categoryId: '',
      goalId: '',
      date: selectedDate,
      createdAt: now.toISOString(),
      reminderDays: [],
    });
  }, [reset, selectedDate]);

  const onSubmit = useCallback(
    async (data: AddTodoSchemaType) => {
      try {
        const todoData = {
          id: Date.now().toString(),
          title: data.title.trim(),
          description: data.description?.trim() || '',
          startTime: data.startTime,
          endTime: data.endTime,
          date: data.date,
          status: TaskStatus.PENDING,
          categoryId: data.categoryId ?? '',
          goalId: data.goalId ?? '',
          createdAt: data.createdAt,
          updatedAt: '',
          reminderDays: data.reminderDays?.map(String),
        };

        await createTask(todoData).then(() => {
          reset();
          router.push('/tabs/(tabs)/todos');
        });
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    },
    [createTask, reset],
  );

  return {
    form,
    onSubmit,
  };
};
