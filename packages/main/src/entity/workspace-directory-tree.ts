import type { Directory } from '../../../common/directory-tree';
import type { WorkspaceInputData } from './workspace-input-data';

export class WorkspaceDirectoryTree {
  private tree: Directory | null = null;

  constructor(public name: string, public path: string, public inputData: WorkspaceInputData[]) {}
}
