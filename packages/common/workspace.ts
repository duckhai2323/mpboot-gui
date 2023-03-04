export interface IWorkspace {
  id: number;
  name: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceChooseDirectoryDialogResult {
  canceled: boolean;
  directoryPath?: string;
}
