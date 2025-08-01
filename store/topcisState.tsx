import { Topic, topicStorage } from '@/storage/topicStorage';
import { create } from 'zustand';

export interface TopicState {
  topic: Topic | null;
  topics: Topic[];
  publicTopics: Topic[];
  userTopics: Topic[];
  selectedTopic: Topic | null;

  isLoading: boolean;
  isEditDrawerOpen: boolean;

  setSelectedTopic: (topic: Topic | null) => void;
  setEditDrawerOpen: (open: boolean) => void;

  loadPublicTopics: () => Promise<void>;
  loadUserTopics: (userId: string) => Promise<void>;
  createTopic: (topic: Topic) => Promise<void>;
  updateTopic: (topic: Topic) => Promise<void>;
  getTopicById: (id: string) => Promise<Topic | null>;
}

export const useTopicStore = create<TopicState>((set, get) => ({
  topic: null,
  topics: [],
  publicTopics: [],
  userTopics: [],
  selectedTopic: null,
  isLoading: false,
  isEditDrawerOpen: false,

  setSelectedTopic: (topic: Topic | null) => {
    set({ selectedTopic: topic });
  },

  setEditDrawerOpen: (open: boolean) => {
    const state = get();
    set({
      isEditDrawerOpen: open,
      selectedTopic: open ? state.selectedTopic : null,
    });
  },

  loadPublicTopics: async () => {
    set({ isLoading: true });
    try {
      const topics = await topicStorage.getAllPublicTopics();
      set({ publicTopics: topics, isLoading: false });
    } catch (error) {
      console.error('Failed to load public topics:', error);
      set({ isLoading: false });
    }
  },

  loadUserTopics: async (userId: string) => {
    set({ isLoading: true });
    try {
      const userTopics = await topicStorage.getUserTopics(userId);
      set({ userTopics: userTopics, isLoading: false });
    } catch (error) {
      console.error('Failed to load user topics:', error);
      set({ isLoading: false });
    }
  },

  createTopic: async (topic: Topic) => {
    set({ isLoading: true });
    try {
      await topicStorage.createTopic(topic);
      await get().loadUserTopics(topic.userId as string);
      if (topic.isPublic) {
        await get().loadPublicTopics();
      }
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to create topic:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateTopic: async (topic: Topic) => {
    set({ isLoading: true });
    try {
      await topicStorage.updateTopic(topic);
      await get().loadUserTopics(topic.userId as string);
      if (topic.isPublic) {
        await get().loadPublicTopics();
      }
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to update topic:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  getTopicById: async (id: string) => {
    set({ isLoading: true });
    try {
      const topic = await topicStorage.getTopicById(id);
      set({ topic, isLoading: false });
      return topic;
    } catch (error) {
      console.error('Failed to get topic by id:', error);
      set({ isLoading: false });
      return null;
    }
  },
}));
