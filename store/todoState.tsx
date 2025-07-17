import { create } from 'zustand';
import { Todo, getTodos, clearTodos, addTodo, updateTodo as storageUpdateTodo, deleteTodo } from '@/storage/todoStorage';
import { useEffect } from 'react';

interface TodoState {
  todos: Todo[];
  selectedDate: string;
  loading: boolean;
  error: string | null;
  setSelectedDate: (date: string, filterNotCompleted?: boolean, filterNotCanceled?: boolean) => Promise<void>;
  addTodo: (todo: Todo) => Promise<void>;
  updateTodo: (todo: Todo) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  clearTodos: () => Promise<void>;
  loadTodos: (date: string, filterNotCompleted?: boolean, filterNotCanceled?: boolean) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  selectedDate: new Date().toISOString().split('T')[0],
  todos: [],
  loading: false,
  error: null,
  filterNotCompleted: false,
  filterNotCanceled: false,

  setSelectedDate: async (date: string, filterNotCompleted?: boolean, filterNotCanceled?: boolean) => {
    set({ selectedDate: date, loading: true, error: null });
    try {
      const todos = await getTodos(date, filterNotCompleted, filterNotCanceled);
      set({ todos, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },

  loadTodos: async (date: string, filterNotCompleted?: boolean, filterNotCanceled?: boolean) => {
    set({ loading: true, error: null });
    try {
      const todos = await getTodos(date, filterNotCompleted, filterNotCanceled);
      set({ todos, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },

  addTodo: async (todo: Todo) => {
    set({ loading: true, error: null });
    try {
      await addTodo(todo);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },

  updateTodo: async (todo: Todo) => {
    set({ loading: true, error: null });
    try {
      await storageUpdateTodo(todo).finally(() => set({ loading: false }));
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },

  removeTodo: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteTodo(id);
      const { selectedDate } = get();
      const updatedTodos = await getTodos(selectedDate);
      set({ todos: updatedTodos, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },

  clearTodos: async () => {
    set({ loading: true, error: null });
    try {
      const { selectedDate } = get();
      await clearTodos(selectedDate);
      set({ todos: [], loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
}));

export const useTodoStoreWithInitialLoad = () => {
  const store = useTodoStore();
  useEffect(() => {
    store.loadTodos(store.selectedDate);
  }, []);

  return store;
};
