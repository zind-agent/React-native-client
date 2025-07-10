import { create } from 'zustand';
import { Todo, getTodos, clearTodos, addTodo, updateTodo, deleteTodo } from '@/storage/todoStorage';
import { useEffect } from 'react';

interface TodoState {
  todos: Todo[];
  selectedDate: string;
  loading: boolean;
  error: string | null;
  setSelectedDate: (date: string) => void;
  addTodo: (todo: Todo) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  clearTodos: () => Promise<void>;
  loadTodos: (date: string) => Promise<void>;
  refreshTodos: () => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  selectedDate: new Date().toISOString().split('T')[0],
  todos: [],
  loading: false,
  error: null,

  setSelectedDate: async (date: string) => {
    set({ selectedDate: date, loading: true, error: null });
    try {
      const todos = await getTodos(date);
      set({ todos, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  loadTodos: async (date: string) => {
    set({ loading: true });
    try {
      const todos = await getTodos(date);
      set({ todos: todos, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  refreshTodos: async () => {
    const { selectedDate } = get();
    await get().loadTodos(selectedDate);
  },

  addTodo: async (todo: Todo) => {
    set({ loading: true });
    try {
      await addTodo(todo);
      if (todo.date === get().selectedDate) {
        const updatedTodos = await getTodos(todo.date);
        set({ todos: updatedTodos, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
    }
  },

  toggleTodo: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { todos } = get();
      const todo = todos.find((t) => t.id === id);

      if (todo) {
        const updatedTodo = { ...todo, completed: !todo.completed };
        await updateTodo(updatedTodo);
        const updatedTodos = todos.map((t) => (t.id === id ? updatedTodo : t));
        set({ todos: updatedTodos, loading: false });
      }
    } catch (error) {
      set({ loading: false });
    }
  },

  removeTodo: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteTodo(id);

      const updatedTodos = get().todos.filter((todo) => todo.id !== id);
      set({ todos: updatedTodos, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  clearTodos: async () => {
    set({ loading: true, error: null });
    try {
      const { selectedDate } = get();
      await clearTodos(selectedDate);
      set({ todos: [], loading: false });
    } catch (error) {
      set({ loading: false });
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
