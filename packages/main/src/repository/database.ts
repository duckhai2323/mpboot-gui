import { Database } from 'sqlite3';

export interface IDatabase {
  run(query: string): Promise<void>;
  run(query: string, params: any[]): Promise<void>;
  getOne<T>(query: string): Promise<T>;
  getOne<T>(query: string, params: any[]): Promise<T>;
  getMany<T>(query: string): Promise<T[]>;
  getMany<T>(query: string, params: any[]): Promise<T[]>;
  serialize(callback: (db: IDatabase) => Promise<void>): Promise<void>;
}

export class Sqlite3Database implements IDatabase {
  private db: Database;
  constructor(dbPath: string) {
    this.db = new Database(dbPath);
  }
  getMany<T>(query: string, params?: any[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  getOne<T>(query: string, params?: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err || !row) {
          reject(err ?? new Error('No row found'));
        } else {
          resolve(row);
        }
      });
    });
  }

  run(query: string, params?: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  serialize(callback: (db: IDatabase) => Promise<void>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(async () => {
        try {
          await callback(this);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}
