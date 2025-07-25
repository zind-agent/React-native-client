import { TaskStatus } from '@/constants/TaskEnum';
import * as SQLite from 'expo-sqlite';

export interface Task {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  startTime: string;
  endTime: string;
  date: string;
  status: TaskStatus;
  reminderDays?: string[];
  categoryId?: string;
  goalId?: string;
  createdAt: string;
  updatedAt: string;
}

export class TaskStorage {
  private static instance: TaskStorage;
  private db: SQLite.SQLiteDatabase;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {
    this.db = SQLite.openDatabaseSync('tasks.taskdb');
  }

  public static getInstance(): TaskStorage {
    if (!TaskStorage.instance) {
      TaskStorage.instance = new TaskStorage();
    }
    return TaskStorage.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        const result = await this.db.getAllAsync(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='tasks';
      `);

        if (result.length === 0) {
          await this.db.runAsync(`
          CREATE TABLE tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT DEFAULT '',
            tags TEXT NOT NULL DEFAULT '[]',
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'PENDING',
            reminder_days TEXT NOT NULL DEFAULT '[]',
            category_id TEXT DEFAULT NULL,
            goal_id TEXT DEFAULT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,

            CHECK (date LIKE '____-__-__'),
            CHECK (start_time LIKE '__:__'),
            CHECK (end_time LIKE '__:__'),
            CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED'))
          );
        `);
          console.warn('[Database] Tasks table created for the first time.');
        } else {
          console.warn('[Database] Tasks table already exists.');
        }

        this.isInitialized = true;
        this.initializationPromise = null;
      } catch (error) {
        this.initializationPromise = null;
        console.error('Database initialization failed:', error);
        throw new Error(`Failed to initialize database: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    })();

    return this.initializationPromise;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  private validateTask(task: Partial<Task>): void {
    if (!task.id?.trim()) throw new Error('Task ID is required');
    if (!task.title?.trim()) throw new Error('Task title is required');
    if (!task.date?.match(/^\d{4}-\d{2}-\d{2}$/)) throw new Error('Invalid date format. Expected: YYYY-MM-DD');
    if (!task.startTime?.match(/^\d{2}:\d{2}$/)) throw new Error('Invalid start time format. Expected: HH:MM');
    if (!task.endTime?.match(/^\d{2}:\d{2}$/)) throw new Error('Invalid end time format. Expected: HH:MM');
    if (!['PENDING', 'CANCELLED', 'COMPLETED'].includes(task.status ?? '')) throw new Error('Invalid status value');
  }

  private TaskToRow(task: Task) {
    return {
      id: task.id,
      title: task.title.trim(),
      description: task.description?.trim() || '',
      tags: JSON.stringify(task.tags || []),
      start_time: task.startTime,
      end_time: task.endTime,
      date: task.date,
      status: task.status,
      category_id: task.categoryId ?? null,
      reminder_days: JSON.stringify(task.reminderDays || []),
      goal_id: task.goalId ?? null,
      created_at: task.createdAt,
      updated_at: task.updatedAt,
    };
  }

  private rowToTask(row: any): Task {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      tags: JSON.parse(row.tags ?? '[]'),
      startTime: row.start_time,
      endTime: row.end_time,
      date: row.date,
      status: row.status as TaskStatus,
      reminderDays: JSON.parse(row.reminder_days ?? '[]'),
      categoryId: row.category_id ?? undefined,
      goalId: row.goal_id ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  public async createTask(task: Task): Promise<void> {
    await this.ensureInitialized();
    this.validateTask(task);

    try {
      const row = this.TaskToRow(task);
      await this.db.runAsync(
        `INSERT INTO tasks (
            id, title, description, tags, start_time, end_time,
            date, status, category_id, goal_id, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [row.id, row.title, row.description, row.tags, row.start_time, row.end_time, row.date, row.status, row.category_id, row.goal_id, row.created_at, row.updated_at],
      );
    } catch (error) {
      console.error(`Failed to create task with ID ${task.id}:`, error);
      throw new Error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async updateTask(task: Task): Promise<void> {
    await this.ensureInitialized();
    this.validateTask(task);

    try {
      const row = this.TaskToRow(task);
      const result = await this.db.runAsync(
        `UPDATE tasks SET
            title = ?, description = ?, tags = ?, start_time = ?, end_time = ?,
            date = ?, status = ?, category_id = ?, goal_id = ?, updated_at = ?
          WHERE id = ?`,
        [row.title, row.description, row.tags, row.start_time, row.end_time, row.date, row.status, row.category_id, row.goal_id, new Date().toISOString(), row.id],
      );

      if (result.changes === 0) {
        throw new Error(`Task with ID ${task.id} not found`);
      }
    } catch (error) {
      console.error(`Failed to update task with ID ${task.id}:`, error);
      throw new Error(`Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async loadTasksByDate(date: string, status?: TaskStatus): Promise<Task[]> {
    await this.ensureInitialized();
    if (!date?.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new Error('Invalid date format. Expected: YYYY-MM-DD');
    }

    try {
      let query = 'SELECT * FROM tasks WHERE date = ?';
      let params: any[] = [date];

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      const results = await this.db.getAllAsync(query, params);
      return results.map((row: any) => this.rowToTask(row));
    } catch (error) {
      console.error(`Failed to get tasks for date ${date}:`, error);
      throw new Error(`Failed to get tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getTaskById(id: string): Promise<Task> {
    await this.ensureInitialized();
    if (!id) {
      throw new Error('Task ID is required');
    }

    try {
      let query = 'SELECT * FROM tasks WHERE id = ?';
      let params: any[] = [id];

      const results = await this.db.getFirstAsync(query, params);
      return this.rowToTask(results);
    } catch (error) {
      console.error(`Failed to get tasks for date ${id}:`, error);
      throw new Error(`Failed to get tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const taskStorage = TaskStorage.getInstance();
