import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useTodoStore } from '@/store/todoState';
import { addTodoSchema, AddTodoSchemaType } from '@/components/schema/addTodoSchema';
import { TaskStatus } from '@/constants/TaskEnum';
import { router } from 'expo-router';
import { useAppStore } from '@/store/appState';
import { Task } from '@/storage/todoStorage';

interface Props {
  selectedDate: string;
  task?: Task | null;
}

export const useTodoForm = ({ selectedDate, task }: Props) => {
  const { createTask, updateTask } = useTodoStore();
  const { user } = useAppStore();

  const isEditMode = Boolean(task?.id);

  const form = useForm<AddTodoSchemaType>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: {
      title: task?.title || '',
      startTime: task?.startTime || '',
      endTime: task?.endTime || '',
      description: task?.description || '',
      categoryId: task?.categoryId || '',
      goalId: task?.goalId || '',
      date: task?.date || selectedDate,
      createdAt: task?.createdAt || new Date().toISOString(),
      reminderDays: task?.reminderDays || [],
    },
    mode: 'onSubmit',
  });

  const { reset } = form;

  useEffect(() => {
    if (isEditMode && task) {
      reset({
        title: task.title,
        startTime: task.startTime,
        endTime: task.endTime,
        description: task.description,
        categoryId: task.categoryId,
        goalId: task.goalId,
        date: task.date,
        createdAt: task.createdAt,
        reminderDays: task.reminderDays || [],
      });
    } else {
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
    }
  }, [reset, selectedDate, task, isEditMode]);

  const onSubmit = useCallback(
    async (data: AddTodoSchemaType) => {
      try {
        const todoData = {
          id: isEditMode ? task!.id : Date.now().toString(),
          userId: user?.id as string,
          title: data.title.trim(),
          description: data.description?.trim() || '',
          startTime: data.startTime,
          endTime: data.endTime,
          date: data.date,
          status: task?.status ?? TaskStatus.PENDING,
          categoryId: data.categoryId ?? '',
          goalId: data.goalId ?? '',
          createdAt: data.createdAt,
          updatedAt: new Date().toISOString(),
          reminderDays: data.reminderDays?.map(String),
        };

        if (isEditMode) {
          await updateTask(todoData);
        } else {
          await createTask(todoData);
        }

        reset();
        router.push('/tabs/(tabs)/todos');
      } catch (error) {
        console.error('Error saving task:', error);
      }
    },
    [createTask, updateTask, reset, task, isEditMode, user],
  );

  const onDelete = useCallback(async () => {
    try {
      if (isEditMode && task) {
        router.push('/tabs/(tabs)/todos');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [isEditMode, task]);

  return {
    form,
    onSubmit,
    onDelete,
    isEditMode,
  };
};
