import { create } from 'zustand';
import { useEffect } from 'react';
import todoStorage, { Todo } from '@/storage/todoStorage';

interface TodoState {
  todos: Todo[];
  todo: Todo | null;
  todayInprogressTodos: Todo[];
  selectedDate: string;
  currentDate: string;
  loading: boolean;
  error: string | null;
  addTodo: (todo: Todo) => Promise<void>;
  updateTodo: (todo: Todo) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  clearTodos: () => Promise<void>;
  getTodoById: (id: string) => Promise<Todo | null>;
  loadTodos: (date: string, filterNotCompleted?: boolean, filterNotCanceled?: boolean) => Promise<void>;
  setTodo: (todo: Todo | null) => void;
  editDrawer: boolean;
  setEditDrawer: () => void;
  openEditDrawerById: ({ taskId }: { taskId: string }) => void;
  editLoading: boolean;
  loadTodayInprogressTodos: (filterNotCompleted?: boolean, filterNotCanceled?: boolean) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  selectedDate: new Date().toISOString().split('T')[0],
  todos: [],
  currentDate: new Date().toISOString().split('T')[0],
  todayInprogressTodos: [],
  todo: null,
  loading: false,
  error: null,
  modalLoading: false,
  filterNotCompleted: false,
  filterNotCanceled: false,
  setTodo: (todo: Todo | null) => set({ todo }),
  editDrawer: false,
  editLoading: false,
  setEditDrawer: () => set({ editDrawer: false, todo: null }),

  openEditDrawerById: async ({ taskId }: { taskId: string }) => {
    set({ editLoading: true });
    if (taskId) {
      const todo = await todoStorage.getTodoById(taskId);
      if (todo) {
        set({ todo, editLoading: false, editDrawer: true });
      }
    }
  },

  getTodoById: async (id: string) => {
    set({ editLoading: true });
    try {
      const todo = await todoStorage.getTodoById(id);
      set({ todo, editLoading: false });
      return todo;
    } catch (error: any) {
      set({ editLoading: false, error: error.message });
      return null;
    }
  },

  loadTodos: async (date: string, filterNotCompleted?: boolean, filterNotCanceled?: boolean) => {
    set({ loading: true, error: null });
    try {
      const todos = await todoStorage.getTodos(date, filterNotCompleted, filterNotCanceled);
      set({ todos, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },

  loadTodayInprogressTodos: async (filterNotCompleted?: boolean, filterNotCanceled?: boolean) => {
    set({ loading: true, error: null });
    try {
      const todos = await todoStorage.getTodos(get().selectedDate, filterNotCompleted, filterNotCanceled);
      set({ todayInprogressTodos: todos, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },

  addTodo: async (todo: Todo) => {
    set({ editLoading: true, error: null });
    try {
      await todoStorage.addTodo(todo);
      set({ editLoading: false });
    } catch (error: any) {
      set({ editLoading: false, error: error.message });
    }
  },

  updateTodo: async (todo: Todo) => {
    set({ loading: true, error: null });
    try {
      await todoStorage.updateTodo(todo).finally(() => set({ loading: false }));
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },

  removeTodo: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await todoStorage.deleteTodo(id);
      const { selectedDate } = get();
      const updatedTodos = await todoStorage.getTodos(selectedDate);
      set({ todos: updatedTodos, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },

  clearTodos: async () => {
    set({ loading: true, error: null });
    try {
      const { selectedDate } = get();
      await todoStorage.clearTodos(selectedDate);
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
