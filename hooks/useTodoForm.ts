import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useTodoStore } from '@/store/todoState';
import { addTodoSchema, AddTodoSchemaType } from '@/components/schema/addTodoSchema';
import { useAppStore } from '@/store/appState';

export const useTodoForm = (selectedDate: string) => {
  const { addTodo, loadTodos } = useTodoStore();
  const { setAddInTimeTodoDrawer } = useAppStore();

  const form = useForm<AddTodoSchemaType>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: {
      title: '',
      tags: [],
      start_time: '',
      end_time: '',
      description: '',
      date: selectedDate,
      createdAt: new Date().toISOString(),
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
      tags: [],
      start_time: formatTime(now),
      end_time: formatTime(endTime),
      description: '',
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
          title: data.title,
          tags: data.tags,
          start_time: data.start_time,
          end_time: data.end_time,
          date: data.date,
          isCompleted: false,
          description: data.description,
          createdAt: data.createdAt,
          isCancel: false,
          reminderDays: data.reminderDays,
        };

        await addTodo(todoData).then(() => {
          loadTodos(selectedDate);
          reset();
          setAddInTimeTodoDrawer(false);
        });
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    },
    [addTodo, reset],
  );

  return {
    form,
    onSubmit,
  };
};
