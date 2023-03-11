import { logger } from '../../../common/logger';
import { Database } from 'sqlite3';
import { dbPath } from '../const';
import { Workspace } from '../entity/workspace';
import type { PaginationOptions } from './options';
export class Repository {
  private isMigrated = false;
  private constructor(private db: Database) {
    this.db = db;
  }
  public static init(dbPath: string): Repository {
    logger.debug('Repository.init()', { dbPath });
    const db = new Database(dbPath);
    const repo = new Repository(db);
    return repo;
  }
  private async migrate(): Promise<void> {
    if (this.isMigrated) {
      return;
    }
    logger.debug('Repository.migrate()');

    return new Promise((resolve, reject) => {
      this.db.run(
        `CREATE TABLE IF NOT EXISTS workspaces (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    path TEXT NOT NULL,
                    name TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_used_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`,
        err => {
          if (err) {
            reject(err);
          } else {
            this.isMigrated = true;
            resolve();
          }
        },
      );
    });
  }

  public async createWorkspace(workspace: Workspace): Promise<Workspace> {
    await this.migrate();
    logger.debug('Repository.createWorkspace()', { workspace });
    return new Promise((resolve, reject) => {
      this.db.get(
        'INSERT INTO workspaces (path, name) VALUES (?, ?) returning *',
        [workspace.path, workspace.name],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(Workspace.fromRow(row));
          }
        },
      );
    });
  }
  public async listWorkspaces(paginationOption?: PaginationOptions): Promise<Workspace[]> {
    await this.migrate();
    logger.debug('Repository.listWorkspaces()', { paginationOption });
    return new Promise((resolve, reject) => {
      const limit = paginationOption?.limit || 5;
      const offset = paginationOption?.offset || 0;
      this.db.all(
        'SELECT * FROM workspaces ORDER BY last_used_at DESC LIMIT ? OFFSET ?',
        [limit, offset],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map(row => Workspace.fromRow(row)));
          }
        },
      );
    });
  }

  public async getWorkspaceById(id: number): Promise<Workspace | null> {
    await this.migrate();
    logger.debug('Repository.getWorkspaceById()', { id });
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM workspaces WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (row) {
            resolve(Workspace.fromRow(row));
          }
          resolve(null);
        }
      });
    });
  }
}

export const repository = Repository.init(dbPath);
