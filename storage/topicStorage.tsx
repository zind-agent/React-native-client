import * as SQLite from 'expo-sqlite';

export interface Topic {
  id: string;
  userId: string | number;
  title: string;
  description: string;
  category?: string;
  isPublic: boolean;
  status?: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
}

export class TopicStorage {
  private static instance: TopicStorage;
  private db: SQLite.SQLiteDatabase;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {
    this.db = SQLite.openDatabaseSync('topics.topicdb');
  }

  public static getInstance(): TopicStorage {
    if (!TopicStorage.instance) {
      TopicStorage.instance = new TopicStorage();
    }
    return TopicStorage.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        const result = await this.db.getAllAsync(`
          SELECT name FROM sqlite_master WHERE type='table' AND name='topics';
        `);

        if (result.length === 0) {
          await this.db.runAsync(`
            CREATE TABLE IF NOT EXISTS topics (
              id TEXT PRIMARY KEY,
              title TEXT NOT NULL,
              user_id TEXT NOT NULL,
              status TEXT DEFAULT NULL,
              category TEXT DEFAULT NULL,
              description TEXT DEFAULT '',
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              likes INTEGER DEFAULT 0,
              is_public INTEGER NOT NULL DEFAULT 0
            );
          `);
          console.warn('[Database] Topics table created.');
        }

        this.isInitialized = true;
        this.initializationPromise = null;
      } catch (error) {
        this.initializationPromise = null;
        console.error('Database initialization failed:', error);
        throw new Error('Failed to initialize topics DB.');
      }
    })();

    return this.initializationPromise;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  private topicToRow(topic: Topic) {
    return {
      id: topic.id,
      title: topic.title,
      user_id: topic.userId,
      description: topic.description,
      category: topic.category ?? null,
      status: topic.status ?? null,
      is_public: topic.isPublic ? 1 : 0,
      created_at: topic.createdAt,
      updated_at: topic.updatedAt,
      likes: topic.likes ?? 0,
    };
  }

  private rowToTopic(row: any): Topic {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      category: row.category ?? undefined,
      status: row.status ?? undefined,
      isPublic: !!row.is_public,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      likes: row.likes ?? 0,
    };
  }

  public async createTopic(topic: Topic): Promise<void> {
    await this.ensureInitialized();
    const row = this.topicToRow(topic);
    await this.db.runAsync(
      `INSERT INTO topics (
    id, title, user_id, status, category, description, created_at, updated_at, likes, is_public
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [row.id, row.title, row.user_id, row.status, row.category, row.description, row.created_at, row.updated_at, row.likes, row.is_public],
    );
  }

  public async getAllPublicTopics(): Promise<Topic[]> {
    await this.ensureInitialized();
    const rows = await this.db.getAllAsync(`SELECT * FROM topics`);
    return rows.map(this.rowToTopic);
  }

  public async getUserTopics(userId: string): Promise<Topic[]> {
    await this.ensureInitialized();
    const rows = await this.db.getAllAsync(`SELECT * FROM topics WHERE user_id = ?`, [userId]);
    return rows.map(this.rowToTopic);
  }

  public async getTopicById(id: string): Promise<Topic> {
    await this.ensureInitialized();
    const row = await this.db.getFirstAsync(`SELECT * FROM topics WHERE id = ?`, [id]);
    return this.rowToTopic(row);
  }

  public async updateTopic(topic: Topic): Promise<void> {
    await this.ensureInitialized();
    const row = this.topicToRow(topic);
    await this.db.runAsync(
      `UPDATE topics SET
        title = ?, description = ?, category = ?, status = ?, is_public = ?,  likes = ?, updated_at = ?
       WHERE id = ?`,
      [row.title, row.description, row.category, row.status, row.is_public, row.likes, new Date().toISOString(), row.id],
    );
  }
  public async removeTopic(id: string): Promise<void> {
    await this.ensureInitialized();
    await this.db.runAsync(`DELETE FROM topics WHERE id = ?`, [id]);
  }
}

export const topicStorage = TopicStorage.getInstance();
