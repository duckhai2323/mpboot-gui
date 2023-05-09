import { logger } from '../../../common/logger';
import { dbPath } from '../const';
import { Workspace } from '../entity/workspace';
import type { PaginationOptions } from './options';
import { WorkspaceInputData } from '../entity/workspace-input-data';
import type { IDatabase } from './database';
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
    sequenceNumber: number,
  ): Promise<ExecutionHistory> {
    await this.ensureMigrate();
    logger.debug('Repository.createExecutionHistory()', { workspaceId, sequenceNumber });
    const row = await this.db.getOne(
      'INSERT INTO execution_history (workspace_id, parameters, seed, sequence_number) VALUES (?, ?, ?, ?) RETURNING *',
      [workspaceId, JSON.stringify({}), -1, sequenceNumber],
    );
    return ExecutionHistory.fromRow(row);
  }

  public async getExecutionHistoryByWorkspaceIdAndSequenceNumber(
    workspaceId: number,
    sequenceNumber: number,
  ): Promise<ExecutionHistory | null> {
    await this.ensureMigrate();
    logger.debug('Repository.getExecutionHistoryByWorkspaceIdAndSequenceNumber()', {
      workspaceId,
      sequenceNumber,
    });
    const row = await this.db.getOne(
      'SELECT * FROM execution_history WHERE workspace_id = ? AND sequence_number = ?',
      [workspaceId, sequenceNumber],
    );
    if (!row) {
      return null;
    }
    return ExecutionHistory.fromRow(row);
  }

  public async getNextSequenceNumber(workspaceId: number): Promise<number> {
    await this.ensureMigrate();
    logger.debug('Repository.getNextSequenceNumber()', { workspaceId });
    let { sequenceNumber } = (await this.db.getOne(
      'SELECT MAX(sequence_number) as sequenceNumber FROM execution_history WHERE workspace_id = ?',
      [workspaceId],
    )) as any;
    if (sequenceNumber === undefined) {
      sequenceNumber = -1;
    }
    return sequenceNumber + 1;
  }

  public async updateExecutionHistory(
    workspaceId: number,
    sequenceNumber: number,
    parameter: Parameter,
    seed: number,
    sourceHash: string,
  ): Promise<ExecutionHistory | null> {
    await this.ensureMigrate();
    logger.debug('Repository.updateExecutionHistory()', {
      workspaceId,
      sequenceNumber,
    });
    await this.db.run(
      'UPDATE execution_history SET parameters = ?, seed = ?, source_hash = ? WHERE workspace_id = ? AND sequence_number = ?',
      [JSON.stringify(parameter), seed, sourceHash, workspaceId, sequenceNumber],
    );
    const row = await this.db.getOne(
      'SELECT * FROM execution_history WHERE workspace_id = ? AND sequence_number = ?',
      [workspaceId, sequenceNumber],
    );
    if (!row) {
      return null;
    }

    return ExecutionHistory.fromRow(row);
  }
}

export const repository = Repository.init(dbPath);
