import type { IWorkspaceInputData } from '../../../common/workspace';

export class WorkspaceInputData {
  public id: number;
  public refName: string;
  public type: 'file' | 'directory';
  public inputPath: string;
  constructor(inputData: IWorkspaceInputData) {
    this.id = -1;
    this.refName = inputData.refName;
    this.type = inputData.type;
    this.inputPath = inputData.inputPath;
  }

  public static fromRow(row: any): WorkspaceInputData {
    return {
      id: row.id,
      refName: row.ref_name,
      type: row.type,
      inputPath: row.input_path,
    };
  }
}
