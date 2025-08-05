import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { TaskStatus } from '@/constants/TaskEnum';
import { router } from 'expo-router';
import { AddTopicSchemaType, addTopicSchema } from '@/components/schema/addTopicSchema';
import { useTopicStore } from '@/store/topcisState';
import { useAppStore } from '@/store/appState';

export const useTopicsFrom = (selectedDate: string) => {
  const { createTopic } = useTopicStore();
  const { user } = useAppStore();

  const form = useForm<AddTopicSchemaType>({
    resolver: zodResolver(addTopicSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      createdAt: '',
      updatedAt: '',
      likes: 0,
      isPublic: false,
    },
    mode: 'onSubmit',
  });

  const { reset } = form;

  useEffect(() => {
    const now = new Date();

    reset({
      title: '',
      description: '',
      category: '',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      likes: 0,
    });
  }, [reset, selectedDate]);

  const onSubmit = useCallback(
    async (data: AddTopicSchemaType) => {
      try {
        const topicData = {
          id: Date.now().toString(),
          userId: user?.id || 0,
          title: data.title.trim(),
          description: data.description?.trim() || '',
          status: TaskStatus.PENDING,
          category: data.category ?? '',
          createdAt: data.createdAt,
          updatedAt: '',
          likes: data.likes ?? 0,
          isPublic: false,
        };

        await createTopic(topicData).then(() => {
          reset();
          router.push('/tabs/(tabs)/activity');
        });
      } catch (error) {
        console.error('Error adding Topics:', error);
      }
    },
    [, reset],
  );

  return {
    form,
    onSubmit,
  };
};
