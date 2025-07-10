import * as SQLite from 'expo-sqlite';

export interface Todo {
  id: string;
  title: string;
  tags: string[];
  start_time: string;
  end_time: string;
  date: string;
  completed: boolean;
  createdAt: string;
}

class TodoStorage {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync('todos.db');
    this.initDB();
  }

  private async initDB() {
    try {
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS todos (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          tags TEXT NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          date TEXT NOT NULL,
          completed INTEGER NOT NULL DEFAULT 0,
          createdAt TEXT NOT NULL
        );
      `);
      console.log('پایگاه داده با موفقیت مقداردهی شد.');
    } catch (error: any) {
      console.error('خطا در مقداردهی پایگاه داده:', error);
      throw new Error(`ناتوانی در مقداردهی پایگاه داده: ${error.message}`);
    }
  }

  private todoToRow(todo: Todo) {
    return {
      id: todo.id,
      title: todo.title,
      tags: JSON.stringify(todo.tags || []),
      start_time: todo.start_time,
      end_time: todo.end_time,
      date: todo.date,
      completed: todo.completed ? 1 : 0,
      createdAt: todo.createdAt,
    };
  }

  private rowToTodo(row: any): Todo {
    try {
      return {
        id: row.id,
        title: row.title,
        tags: JSON.parse(row.tags || '[]'),
        start_time: row.start_time,
        end_time: row.end_time,
        date: row.date,
        completed: row.completed === 1,
        createdAt: row.createdAt,
      };
    } catch (error) {
      console.error(`خطا در تبدیل ردیف به Todo برای id ${row.id}:`, error);
      return {
        ...row,
        tags: [],
        completed: row.completed === 1,
      };
    }
  }

  async saveTodos(todos: Todo[], date: string): Promise<void> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`فرمت تاریخ نامعتبر است: ${date}. فرمت مورد انتظار: YYYY-MM-DD`);
    }
    try {
      await this.db.runAsync('BEGIN TRANSACTION;');
      await this.db.runAsync('DELETE FROM todos WHERE date = ?', [date]);
      for (const todo of todos) {
        const row = this.todoToRow(todo);
        await this.db.runAsync(
          `INSERT INTO todos (id, title, tags, start_time, end_time, date, completed, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [row.id, row.title, row.tags, row.start_time, row.end_time, row.date, row.completed, row.createdAt],
        );
      }
      await this.db.runAsync('COMMIT;');
    } catch (error: any) {
      console.error(`خطا در ذخیره کارها برای تاریخ ${date}:`, error);
      await this.db.runAsync('ROLLBACK;');
      throw new Error(`ناتوانی در ذخیره کارها: ${error.message}`);
    }
  }

  async getTodos(date: string): Promise<Todo[]> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`فرمت تاریخ نامعتبر است: ${date}. فرمت مورد انتظار: YYYY-MM-DD`);
    }
    try {
      const results = await this.db.getAllAsync('SELECT * FROM todos WHERE date = ? ORDER BY createdAt DESC', [date]);
      return (results as any[]).map((row) => this.rowToTodo(row));
    } catch (error: any) {
      console.error(`خطا در دریافت کارها برای تاریخ ${date}:`, error);
      throw new Error(`ناتوانی در دریافت کارها: ${error.message}`);
    }
  }

  async clearTodos(date: string): Promise<void> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`فرمت تاریخ نامعتبر است: ${date}. فرمت مورد انتظار: YYYY-MM-DD`);
    }
    try {
      await this.db.runAsync('DELETE FROM todos WHERE date = ?', [date]);
    } catch (error: any) {
      console.error(`خطا در پاک کردن کارها برای تاریخ ${date}:`, error);
      throw new Error(`ناتوانی در پاک کردن کارها: ${error.message}`);
    }
  }

  async clearAllTodos(): Promise<void> {
    try {
      await this.db.runAsync('DELETE FROM todos');
    } catch (error: any) {
      console.error('خطا در پاک کردن همه کارها:', error);
      throw new Error(`ناتوانی در پاک کردن همه کارها: ${error.message}`);
    }
  }

  async addTodo(todo: Todo): Promise<void> {
    if (!todo.id || !todo.title || !todo.date) {
      throw new Error('شناسه، عنوان یا تاریخ کار نمی‌تواند خالی باشد.');
    }
    try {
      const row = this.todoToRow(todo);
      await this.db.runAsync(
        `INSERT INTO todos (id, title, tags, start_time, end_time, date, completed, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [row.id, row.title, row.tags, row.start_time, row.end_time, row.date, row.completed, row.createdAt],
      );
    } catch (error: any) {
      console.error(`خطا در افزودن کار با شناسه ${todo.id}:`, error);
      throw new Error(`ناتوانی در افزودن کار: ${error.message}`);
    }
  }

  async updateTodo(todo: Todo): Promise<void> {
    if (!todo.id || !todo.title || !todo.date) {
      throw new Error('شناسه، عنوان یا تاریخ کار نمی‌تواند خالی باشد.');
    }
    try {
      const row = this.todoToRow(todo);
      await this.db.runAsync(
        `UPDATE todos SET title = ?, tags = ?, start_time = ?, end_time = ?, 
         date = ?, completed = ?, createdAt = ? WHERE id = ?`,
        [row.title, row.tags, row.start_time, row.end_time, row.date, row.completed, row.createdAt, row.id],
      );
    } catch (error: any) {
      console.error(`خطا در به‌روزرسانی کار با شناسه ${todo.id}:`, error);
      throw new Error(`ناتوانی در به‌روزرسانی کار: ${error.message}`);
    }
  }

  async deleteTodo(id: string): Promise<void> {
    if (!id) {
      throw new Error('شناسه کار نمی‌تواند خالی باشد.');
    }
    try {
      await this.db.runAsync('DELETE FROM todos WHERE id = ?', [id]);
    } catch (error: any) {
      console.error(`خطا در حذف کار با شناسه ${id}:`, error);
      throw new Error(`ناتوانی در حذف کار: ${error.message}`);
    }
  }

  async getAllDates(): Promise<string[]> {
    try {
      const results = await this.db.getAllAsync('SELECT DISTINCT date FROM todos ORDER BY date DESC');
      return (results as any[]).map((row) => row.date);
    } catch (error: any) {
      console.error('خطا در دریافت تاریخ‌ها:', error);
      throw new Error(`ناتوانی در دریافت تاریخ‌ها: ${error.message}`);
    }
  }
}

const todoStorage = new TodoStorage();

export const saveTodos = (todos: Todo[], date: string) => {
  return todoStorage.saveTodos(todos, date);
};

export const getTodos = (date: string): Promise<Todo[]> => {
  return todoStorage.getTodos(date);
};

export const clearTodos = (date: string) => {
  return todoStorage.clearTodos(date);
};

export const clearAllTodos = () => {
  return todoStorage.clearAllTodos();
};

export const addTodo = (todo: Todo) => {
  return todoStorage.addTodo(todo);
};

export const updateTodo = (todo: Todo) => {
  return todoStorage.updateTodo(todo);
};

export const deleteTodo = (id: string) => {
  return todoStorage.deleteTodo(id);
};

export const getAllDates = () => {
  return todoStorage.getAllDates();
};

export { todoStorage };
