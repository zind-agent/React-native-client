import { TaskStatus } from '@/constants/TaskEnum';
import { Task, taskStorage } from '@/storage/todoStorage';
import { create } from 'zustand';

export interface TodoState {
  // Data
  task: Task | null;
  tasks: Task[];
  todayTasks: Task[];
  pendingTodayTasks: Task[];
  complitedTasks: Task[];
  selectedTask: Task | null;

  // UI State
  selectedDate: string;
  today: string;
  isLoading: boolean;
  isEditDrawerOpen: boolean;
  setSelectedDate: (date: string) => Promise<void>;
  setSelectedTask: (task: Task | null) => void;
  setEditDrawerOpen: (open: boolean) => void;

  // Task Operations
  loadTasks: (date: string) => Promise<void>;
  loadTodayTasks: () => Promise<void>;
  loadPendingTodayTasks: () => Promise<void>;
  loadComplitedTasks: () => Promise<void>;
  createTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  getCompletionPercentage: () => number;
  getTaskById: (id: string) => Promise<Task | null>;
}

const getCurrentDate = (): string => new Date().toISOString().split('T')[0];

export const useTodoStore = create<TodoState>((set, get) => ({
  task: null,
  tasks: [],
  todayTasks: [],
  pendingTodayTasks: [],
  complitedTasks: [],
  selectedDate: getCurrentDate(),
  today: getCurrentDate(),
  selectedTask: null,
  error: null,
  isLoading: false,
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

  loadTasks: async (date: string) => {
    set({ isLoading: true });
    try {
      const tasks = await taskStorage.loadTasksByDate(date);
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Failed to load tasks:', error);
      set({
        isLoading: false,
      });
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

      if (task.date === state.today) {
        await state.loadTodayTasks();
        await state.loadPendingTodayTasks();
      }

      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to create task:', error);
      set({
        isLoading: false,
      });
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
      set({
        isLoading: false,
      });
      throw error;
    }
  },

  loadTodayTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await taskStorage.loadTasksByDate(get().today);
      set({ todayTasks: tasks, isLoading: false });
    } catch (error) {
      console.error('Failed to load today tasks:', error);
      set({
        isLoading: false,
      });
    }
  },

  loadPendingTodayTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await taskStorage.loadTasksByDate(get().today, TaskStatus.PENDING);
      set({ pendingTodayTasks: tasks, isLoading: false });
    } catch (error) {
      console.error('Failed to load today tasks:', error);
      set({
        isLoading: false,
      });
    }
  },

  loadComplitedTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await taskStorage.loadTasksByDate(get().today, TaskStatus.COMPLETED);
      set({ complitedTasks: tasks, isLoading: false });
    } catch (error) {
      console.error('Failed to load today tasks:', error);
      set({
        isLoading: false,
      });
    }
  },

  getCompletionPercentage: () => {
    const tasks = get().tasks;
    const validTasks = tasks.filter((task) => task.status !== TaskStatus.CANCELLED);

    if (validTasks.length === 0) return 0;

    const completedTasks = validTasks.filter((task) => task.status === TaskStatus.COMPLETED);

    return Math.round((completedTasks.length / validTasks.length) * 100);
  },

  getTaskById: async (id: string) => {
    set({ isLoading: true });
    try {
      const task = await taskStorage.getTaskById(id);
      set({ task, isLoading: false });
      return task;
    } catch (error) {
      console.error('Failed to get task by id:', error);
      set({ isLoading: false });
      return null;
    }
  },
}));
