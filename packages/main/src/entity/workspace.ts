import { basename } from 'path';

export class Workspace {
  public id: number;
  public name: string;
  public createdAt: Date;
  public updatedAt: Date;
  constructor(public path: string) {
    this.id = -1;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.path = path;
    this.name = basename(path);
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
