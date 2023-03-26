import type { WorkspaceInputData } from './workspace-input-data';

export class Workspace {
  public id: number;
  public name: string;
  public createdAt: Date;
  public updatedAt: Date;
  public path: string;
  public inputData?: WorkspaceInputData[];

  constructor(name: string, path: string) {
    this.id = -1;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.path = path;
    this.name = name;
  }

  public static fromRow(row: any): Workspace {
    return {
      id: row.id,
      path: row.path,
      name: row.name,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.last_used_at),
    };
  }
}
