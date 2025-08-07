import { TaskStatus } from '@/constants/TaskEnum';
import { Task, taskStorage } from '@/storage/todoStorage';
import { create } from 'zustand';

export interface TodoState {
  tasks: Task[];
  allTasks: Task[];
  selectedDate: string;
  isLoading: boolean;
  selectedTask: Task | null;
  isEditDrawerOpen: boolean;
  today: string;

  setSelectedDate: (date: string) => Promise<void>;
  setSelectedTask: (task: Task | null) => void;
  setEditDrawerOpen: (open: boolean) => void;

  loadTasks: (date: string, status?: TaskStatus) => Promise<void>;
  createTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  getCompletionPercentage: () => Promise<number>;

  getTodayAllTask: () => Promise<void>;
}

const getCurrentDate = (): string => new Date().toISOString().split('T')[0];

export const useTodoStore = create<TodoState>((set, get) => ({
  tasks: [],
  allTasks: [],
  selectedDate: getCurrentDate(),
  today: getCurrentDate(),
  isLoading: false,
  selectedTask: null,
  isEditDrawerOpen: false,

  setSelectedDate: async (date: string) => {
    set({ selectedDate: date });
    await get().loadTasks(date);
  },

  setSelectedTask: (task: Task | null) => {
    set({ selectedTask: task });
  },

  setEditDrawerOpen: (open: boolean) => {
    const state = get();
    set({
      isEditDrawerOpen: open,
      selectedTask: open ? state.selectedTask : null,
    });
  },

  loadTasks: async (date: string, status?: TaskStatus) => {
    set({ isLoading: true });
    try {
      let tasks: Task[] = [];
      if (status) {
        tasks = await taskStorage.loadTasksByDateStatus(date, status);
      } else {
        tasks = await taskStorage.loadTasksByDateStatus(date);
      }
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Failed to load tasks:', error);
      set({ isLoading: false });
    }
  },

  createTask: async (task: Task) => {
    set({ isLoading: true });
    try {
      await taskStorage.createTask(task);
      const state = get();
      if (task.date === state.selectedDate) {
        await state.loadTasks(state.selectedDate);
      }
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to create task:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateTask: async (task: Task) => {
    set({ isLoading: true });
    try {
      await taskStorage.updateTask(task);
      const state = get();
      if (task.date === state.selectedDate) {
        await state.loadTasks(state.selectedDate);
      }
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to update task:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  getCompletionPercentage: async () => {
    const validTasks = await taskStorage.loadTasksByDateStatus(getCurrentDate());
    const completedTasks = await taskStorage.loadTasksByDateStatus(getCurrentDate(), TaskStatus.COMPLETED);

    if (validTasks.length === 0) return 0;

    return Math.round((completedTasks.length / validTasks.length) * 100);
  },

  getTodayAllTask: async () => {
    set({ isLoading: true });
    try {
      const tasks = await taskStorage.loadTasksByDateStatus(getCurrentDate());
      set({ allTasks: tasks, isLoading: false });
    } catch (error) {
      console.error('Failed to load today tasks:', error);
      set({ isLoading: false });
    }
  },
}));
