import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { TaskStatus } from '@/constants/TaskEnum';
import { router } from 'expo-router';
import { AddTopicSchemaType, addTopicSchema } from '@/components/schema/addTopicSchema';
import { useTopicStore } from '@/store/topcisState';
import { useAppStore } from '@/store/appState';
import { Topic } from '@/storage/topicStorage';

interface Props {
  topic: Topic | null;
}

export const useTopicsForm = ({ topic }: Props) => {
  const { createTopic, updateTopic } = useTopicStore();
  const { user } = useAppStore();
  const isEditMode = Boolean(topic?.id);

  const form = useForm<AddTopicSchemaType>({
    resolver: zodResolver(addTopicSchema),
    defaultValues: {
      title: topic?.title || '',
      description: topic?.description || '',
      category: topic?.category || '',
      createdAt: topic?.createdAt || new Date().toISOString(),
      updatedAt: topic?.updatedAt || new Date().toISOString(),
      likes: topic?.likes || 0,
      isPublic: topic?.isPublic || false,
    },
    mode: 'onSubmit',
  });

  const { reset } = form;

  useEffect(() => {
    if (isEditMode) {
      reset({
        title: topic?.title,
        description: topic?.description || '',
        category: topic?.category || '',
        createdAt: topic?.createdAt,
        updatedAt: new Date().toISOString(),
        likes: topic?.likes ?? 0,
        isPublic: topic?.isPublic ?? false,
      });
    } else {
      const now = new Date();
      reset({
        title: '',
        description: '',
        category: '',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        likes: 0,
        isPublic: false,
      });
    }
  }, [reset, topic, isEditMode]);

  const onSubmit = useCallback(
    async (data: AddTopicSchemaType) => {
      try {
        const topicData: Topic = {
          id: isEditMode ? topic!.id : Date.now().toString(),
          userId: user?.id || 0,
          title: data.title.trim(),
          description: data.description?.trim() || '',
          status: topic?.status ?? TaskStatus.PENDING,
          category: data.category ?? '',
          createdAt: data.createdAt,
          updatedAt: new Date().toISOString(),
          likes: data.likes ?? 0,
          isPublic: data.isPublic ?? false,
        };

        if (isEditMode) {
          await updateTopic(topicData);
        } else {
          await createTopic(topicData);
        }

        reset();
        router.push('/tabs/(tabs)/activity');
      } catch (error) {
        console.error('Error submitting topic:', error);
      }
    },
    [reset, user, topic, isEditMode, createTopic, updateTopic],
  );

  return {
    form,
    onSubmit,
    isEditMode,
  };
};
