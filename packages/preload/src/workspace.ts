import { ipcRenderer } from 'electron';
import { IPC_EVENTS } from '../../common/ipc';
import type { IWorkspace, WorkspaceChooseDirectoryDialogResult } from '../../common/workspace';

export const openDirectoryForWorkspace = async () => {
  const result = await ipcRenderer.invoke(IPC_EVENTS.WORKSPACE_CHOOSE_DIRECTORY_DIALOG, {});
  return result as WorkspaceChooseDirectoryDialogResult;
};

export const listWorkspaces = async () => {
  const result = await ipcRenderer.invoke(IPC_EVENTS.WORKSPACE_LIST, {});
  return result as IWorkspace[];
};

export const createWorkspace = async (dirPath: string) => {
  const result = await ipcRenderer.invoke(IPC_EVENTS.WORKSPACE_CREATE, dirPath);
  return result as IWorkspace;
};
