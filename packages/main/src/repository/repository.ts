import { logger } from '../../../common/logger';
import { dbPath } from '../const';
import { Workspace } from '../entity/workspace';
import type { PaginationOptions } from './options';
import { WorkspaceInputData } from '../entity/workspace-input-data';
import type { IDatabase} from './database';
import { Sqlite3Database } from './database';
import { Sqlite3Migrator } from './migrate';
import type { Parameter } from '../../../common/parameter';
import { ExecutionHistory } from '../entity/execution-history';
export class Repository {
  private isMigrated = false;
  private constructor(private db: IDatabase) {
    this.db = db;
  }
  public static init(dbPath: string): Repository {
    logger.debug('Repository.init()', { dbPath });
    const db = new Sqlite3Database(dbPath);
    const repo = new Repository(db);
    return repo;
  }
  private async ensureMigrate(): Promise<void> {
    if (this.isMigrated) {
      return;
    }
    logger.debug('Repository.migrate()', { dbPath });
    const migrator = new Sqlite3Migrator(this.db);
    await migrator.migrate();
    this.isMigrated = true;
  }

  public async createWorkspace(workspace: Workspace): Promise<Workspace> {
    logger.debug('Repository.createWorkspace()', { workspace });
    const row = await this.db.getOne(
      'INSERT INTO workspaces (path, name) VALUES (?, ?) returning *',
      [workspace.path, workspace.name],
    );
    return Workspace.fromRow(row);
  }

  public async listWorkspaces(paginationOption?: PaginationOptions): Promise<Workspace[]> {
    await this.ensureMigrate();
    logger.debug('Repository.listWorkspaces()', { paginationOption });
    const limit = paginationOption?.limit || 5;
    const offset = paginationOption?.offset || 0;

    const rows = await this.db.getMany(
      'SELECT * FROM workspaces ORDER BY last_used_at DESC LIMIT ? OFFSET ?',
      [limit, offset],
    );
    return rows.map(Workspace.fromRow);
  }

  public async getWorkspaceById(id: number): Promise<Workspace | null> {
    await this.ensureMigrate();
    logger.debug('Repository.getWorkspaceById()', { id });
    const rows = await this.db.getMany('SELECT * FROM workspaces WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      return null;
    }
    return Workspace.fromRow(rows[0]);
  }

  public async getWorkspaceByDirectoryPath(dirPath: string): Promise<Workspace | null> {
    await this.ensureMigrate();
    logger.debug('Repository.getWorkspaceByDirectoryPath()', { dirPath });
    const rows = await this.db.getMany('SELECT * FROM workspaces WHERE path = ? LIMIT 1', [
      dirPath,
    ]);
    if (!rows.length) {
      return null;
    }
    const workspace = Workspace.fromRow(rows[0]);
    workspace.inputData = await this.getWorkspaceInputDataByWorkspaceId(workspace.id);
    return workspace;
  }

  public async getWorkspaceInputDataByWorkspaceId(
    workspaceId: number,
  ): Promise<WorkspaceInputData[]> {
    await this.ensureMigrate();
    logger.debug('Repository.getWorkspaceInputDataByWorkspaceId()', { workspaceId });
    const rows = await this.db.getMany(
      'SELECT * FROM workspace_input_data WHERE workspace_id = ?',
      [workspaceId],
    );
    if (!rows.length) {
      return [];
    }
    return rows.map(WorkspaceInputData.fromRow);
  }
  public async createInputDataForWorkspace(
    workspaceId: number,
    inputData: WorkspaceInputData[],
  ): Promise<WorkspaceInputData[]> {
    await this.ensureMigrate();
    logger.debug('Repository.createInputDataForWorkspace()', { inputData });
    const values = inputData.map(data => [workspaceId, data.refName, data.type, data.inputPath]);
    if (values.length === 0) {
      return [];
    }
    return await Promise.all(
      values
        .map(
          async e =>
            await this.db.getOne(
              'INSERT INTO workspace_input_data (workspace_id, ref_name, type, input_path) VALUES (?, ?, ?, ?) returning *',
              e,
            ),
        )
        .map(WorkspaceInputData.fromRow),
    );
  }

  public async createExecutionHistory(
    workspaceId: number,
    parameter: Parameter,
    seed: number,
  ): Promise<ExecutionHistory> {
    await this.ensureMigrate();
    logger.debug('Repository.createExecutionHistory()', { workspaceId, parameter, seed });
    return new Promise<ExecutionHistory>(async (resolve, reject) => {
      try {
        await this.db.serialize(async db => {
          let { sequence_number: sequenceNumber } = (await db.getOne(
            'SELECT MAX(sequence_number) as sequence_number FROM execution_history WHERE workspace_id = ?',
            [workspaceId],
          )) as any;
          if (sequenceNumber === undefined) {
            sequenceNumber = -1;
          }
          const row = await this.db.getOne(
            'INSERT INTO execution_history (workspace_id, parameters, seed, sequence_number) VALUES (?, ?, ?, ?) RETURNING *',
            [workspaceId, JSON.stringify(parameter), seed, sequenceNumber + 1],
          );
          resolve(ExecutionHistory.fromRow(row));
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  public async getExecutionHistoryByWorkspaceIdAndSequenceNumber(
    workspaceId: number,
    sequenceNumber: number,
  ): Promise<ExecutionHistory | null> {
    return new Promise<ExecutionHistory | null> (async (resolve, reject) => {
      try {
        await this.ensureMigrate();
        logger.debug('Repository.getExecutionHistoryByWorkspaceIdAndSequenceNumber()', {
          workspaceId,
          sequenceNumber,
        });
        await this.db.serialize(async db => {
          const row = await db.getOne(
            'SELECT * FROM execution_history WHERE workspace_id = ? AND sequence_number = ?',
            [workspaceId, sequenceNumber],
          );
          if (!row) {
            return resolve(null);
          }
          resolve(ExecutionHistory.fromRow(row));
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  public async getNextSequenceNumber(workspaceId: number): Promise<number> {

    return new Promise<number>(async (resolve, reject) => {
      try {
        await this.ensureMigrate();
        logger.debug('Repository.getNextSequenceNumber()', { workspaceId });
         let { sequence_number: sequenceNumber } = (await this.db.getOne(
          'SELECT MAX(sequence_number) as sequence_number FROM execution_history WHERE workspace_id = ?',
          [workspaceId],
        )) as any;
        if (sequenceNumber === undefined) {
          sequenceNumber = -1;
        }
        resolve(sequenceNumber + 1);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export const repository = Repository.init(dbPath);
