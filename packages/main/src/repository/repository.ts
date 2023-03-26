import { logger } from '../../../common/logger';
import { Database } from 'sqlite3';
import { dbPath } from '../const';
import { Workspace } from '../entity/workspace';
import type { PaginationOptions } from './options';
import { WorkspaceInputData } from '../entity/workspace-input-data';
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
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');
        this.db.run(`CREATE TABLE IF NOT EXISTS workspaces (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          path TEXT NOT NULL,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_used_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        this.db.run(`CREATE TABLE IF NOT EXISTS workspace_input_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          workspace_id INTEGER NOT NULL,
          ref_name TEXT NOT NULL,
          type TEXT NOT NULL,
          input_path TEXT NOT NULL
        )`);
        this.db.run('COMMIT', err => {
          if (err) {
            reject(err);
          } else {
            this.isMigrated = true;
            resolve();
          }
        });
      });
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

  public async getWorkspaceByDirectoryPath(dirPath: string): Promise<Workspace | null> {
    await this.migrate();
    logger.debug('Repository.getWorkspaceByDirectoryPath()', { dirPath });
    const getWsPromise = new Promise<Workspace | null>((resolve, reject) => {
      this.db.get('SELECT * FROM workspaces WHERE path = ? LIMIT 1', [dirPath], (err, row) => {
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
    const ws = await getWsPromise;
    if (!ws) {
      return null;
    }
    ws.inputData = await this.getWorkspaceInputDataByWorkspaceId(ws.id);
    return ws;
  }
  public async getWorkspaceInputDataByWorkspaceId(
    workspaceId: number,
  ): Promise<WorkspaceInputData[]> {
    await this.migrate();
    logger.debug('Repository.getWorkspaceInputDataByWorkspaceId()', { workspaceId });
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM workspace_input_data WHERE workspace_id = ?',
        workspaceId,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            if (rows) {
              resolve(rows.map(WorkspaceInputData.fromRow));
            } else {
              resolve([]);
            }
          }
        },
      );
    });
  }
  public async createInputDataForWorkspace(
    workspaceId: number,
    inputData: WorkspaceInputData[],
  ): Promise<WorkspaceInputData[]> {
    await this.migrate();
    logger.debug('Repository.createInputDataForWorkspace()', { inputData });
    const values = inputData.map(data => [workspaceId, data.refName, data.type, data.inputPath]);
    if (values.length === 0) {
      return [];
    }
    return new Promise((resolve, reject) => {
      const rows: WorkspaceInputData[] = [];
      for (const value of values) {
        this.db.get(
          'INSERT INTO workspace_input_data (workspace_id, ref_name, type, input_path) VALUES (?, ?, ?, ?) returning *',
          value,
          (err, row) => {
            if (err) {
              reject(err);
            } else {
              rows.push(WorkspaceInputData.fromRow(row));
              if (rows.length === values.length) {
                resolve(rows);
              }
            }
          },
        );
      }
    });
  }
}

export const repository = Repository.init(dbPath);
