export interface IWorkspace {
  id: number;
  name: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  inputData?: IWorkspaceInputData[];
}

export interface CreateWorkspaceRequest {
  name: string;
  path: string;
  inputData: IWorkspaceInputData[];
}

export interface DialogChooseDirectoryOrFileResult {
  canceled: boolean;
  paths?: string[];
}

export interface IWorkspaceInputData {
  refName: string;
  type: 'file' | 'directory';
  inputPath: string;
}
