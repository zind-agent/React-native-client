import * as SQLite from 'expo-sqlite';

export interface Todo {
  id: string;
  title: string;
  tags: string[];
  start_time: string;
  end_time: string;
  date: string;
  isCompleted: boolean;
  createdAt: string;
  description: string;
  isCancel: boolean;
}

export class TodoStorage {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync('todos.zindDB');
    this.initDB();
  }

  private async initDB() {
    try {
      await this.db.runAsync(`
        CREATE TABLE IF NOT EXISTS todos (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          tags TEXT NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          date TEXT NOT NULL,
          description TEXT,
          completed INTEGER NOT NULL DEFAULT 0,
          createdAt TEXT NOT NULL,
          is_cancel INTEGER NOT NULL DEFAULT 0
        );
        CREATE INDEX IF NOT EXISTS idx_todos_date ON todos (date);
        CREATE INDEX IF NOT EXISTS idx_todos_id ON todos (id);
        CREATE INDEX IF NOT EXISTS idx_todos_completed_cancel ON todos (completed, is_cancel);
      `);
    } catch (error: any) {
      console.error('خطا در مقداردهی پایگاه داده:', error);
      throw new Error(`ناتوانی در مقداردهی پایگاه داده: ${error.message}`);
    }
  }

  private validateDateFormat(date: string): void {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`فرمت تاریخ نامعتبر است: ${date}. فرمت مورد انتظار: YYYY-MM-DD`);
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
      completed: todo.isCompleted ? 1 : 0,
      createdAt: todo.createdAt,
      description: todo.description,
      is_cancel: todo.isCancel ? 1 : 0,
    };
  }

  private rowToTodo(row: any): Todo {
    try {
      return {
        id: row.id,
        title: row.title,
        tags: row.tags ? JSON.parse(row.tags) : [],
        start_time: row.start_time,
        end_time: row.end_time,
        date: row.date,
        description: row.description,
        isCompleted: !!row.completed,
        createdAt: row.createdAt,
        isCancel: !!row.is_cancel,
      };
    } catch (error: any) {
      console.error(`خطا در تبدیل ردیف به Todo برای id ${row.id}:`, error);
      throw new Error(`ناتوانی در تبدیل ردیف به Todo: ${error.message}`);
    }
  }

  async saveTodos(todos: Todo[], date: string): Promise<void> {
    this.validateDateFormat(date);
    try {
      await this.db.runAsync('BEGIN TRANSACTION;');
      await this.db.runAsync('DELETE FROM todos WHERE date = ?', [date]);
      for (const todo of todos) {
        const row = this.todoToRow(todo);
        await this.db.runAsync(
          `INSERT INTO todos (id, title, tags, start_time, end_time, date, completed, createdAt, is_cancel) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [row.id, row.title, row.tags, row.start_time, row.end_time, row.date, row.completed, row.createdAt, row.is_cancel],
        );
      }
      await this.db.runAsync('COMMIT;');
    } catch (error: any) {
      await this.db.runAsync('ROLLBACK;');
      console.error(`خطا در ذخیره تسک‌ها برای تاریخ ${date}:`, error);
      throw new Error(`ناتوانی در ذخیره تسک‌ها: ${error.message}`);
    }
  }

  async getTodoById(id: string): Promise<Todo | null> {
    try {
      const result = await this.db.getFirstAsync('SELECT * FROM todos WHERE id = ?', [id]);
      if (!result) return null;
      return this.rowToTodo(result);
    } catch (error: any) {
      console.error(`خطا در دریافت تسک با شناسه ${id}:`, error);
      throw new Error(`ناتوانی در دریافت تسک: ${error.message}`);
    }
  }

  async getTodos(date: string, filterNotCompleted: boolean = false, filterNotCanceled: boolean = false): Promise<Todo[]> {
    this.validateDateFormat(date);
    try {
      let query = 'SELECT * FROM todos WHERE date = ?';
      const params = [date];

      if (filterNotCompleted || filterNotCanceled) {
        const conditions = [];
        if (filterNotCompleted) conditions.push('completed = 0');
        if (filterNotCanceled) conditions.push('is_cancel = 0'); // اصلاح: غیرلغوشده
        query += ` AND ${conditions.join(' AND ')}`;
      }

      query += ' ORDER BY createdAt DESC';
      const results = await this.db.getAllAsync(query, params);
      return (results as any[]).map((row) => this.rowToTodo(row));
    } catch (error: any) {
      console.error(`خطا در دریافت تسک‌ها برای تاریخ ${date}:`, error);
      throw new Error(`ناتوانی در دریافت تسک‌ها: ${error.message}`);
    }
  }

  async addTodo(todo: Todo): Promise<void> {
    if (!todo.id || !todo.title || !todo.date) {
      throw new Error('شناسه، عنوان یا تاریخ تسک نمی‌تواند خالی باشد.');
    }
    try {
      const row = this.todoToRow(todo);
      await this.db.runAsync(
        `INSERT INTO todos (id, title, tags, start_time, end_time, date, completed, createdAt, is_cancel) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [row.id, row.title, row.tags, row.start_time, row.end_time, row.date, row.completed, row.createdAt, row.is_cancel],
      );
    } catch (error: any) {
      console.error(`خطا در افزودن تسک با شناسه ${todo.id}:`, error);
      throw new Error(`ناتوانی در افزودن تسک: ${error.message}`);
    }
  }

  async updateTodo(todo: Todo): Promise<void> {
    if (!todo.id || !todo.title || !todo.date) {
      throw new Error('شناسه، عنوان یا تاریخ تسک نمی‌تواند خالی باشد.');
    }
    try {
      const row = this.todoToRow(todo);
      await this.db.runAsync(
        `UPDATE todos SET title = ?, tags = ?, start_time = ?, end_time = ?, 
         date = ?, completed = ?, createdAt = ?, is_cancel = ? WHERE id = ?`,
        [row.title, row.tags, row.start_time, row.end_time, row.date, row.completed, row.createdAt, row.is_cancel, row.id],
      );
    } catch (error: any) {
      console.error(`خطا در به‌روزرسانی تسک با شناسه ${todo.id}:`, error);
      throw new Error(`ناتوانی در به‌روزرسانی تسک: ${error.message}`);
    }
  }

  async deleteTodo(id: string): Promise<void> {
    if (!id) throw new Error('شناسه تسک نمی‌تواند خالی باشد.');
    try {
      await this.db.runAsync('DELETE FROM todos WHERE id = ?', [id]);
    } catch (error: any) {
      console.error(`خطا در حذف تسک با شناسه ${id}:`, error);
      throw new Error(`ناتوانی در حذف تسک: ${error.message}`);
    }
  }

  async clearTodos(date: string): Promise<void> {
    this.validateDateFormat(date);
    try {
      await this.db.runAsync('DELETE FROM todos WHERE date = ?', [date]);
    } catch (error: any) {
      console.error(`خطا در پاک کردن تسک‌ها برای تاریخ ${date}:`, error);
      throw new Error(`ناتوانی در پاک کردن تسک‌ها: ${error.message}`);
    }
  }

  async clearAllTodos(): Promise<void> {
    try {
      await this.db.runAsync('DELETE FROM todos');
    } catch (error: any) {
      console.error('خطا در پاک کردن همه تسک‌ها:', error);
      throw new Error(`ناتوانی در پاک کردن همه تسک‌ها: ${error.message}`);
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

export default todoStorage;
