/**
 * @module preload
 */

import type { ExposedElectron } from '../../common/electron';
import { generateLog, subscribeLog, unsubscribeLog } from './log';
import { executeCommand, subscribeCommandCallbackOnFinish } from './command';
import { openContentFile, readContentFile } from './content-file';
import { createWorkspace, listWorkspaces, openDirectoryForWorkspace } from './workspace';
import {
  getFirstLoadDirectoryTree,
  subscribeDirectoryTree,
  exploreDirectory,
  searchDirectoryTree,
} from './directory-tree';
import { contextBridge, ipcRenderer } from 'electron';
import { IPC_EVENTS } from '../../common/ipc';
import { dirname, join } from './fs';
import { basename } from 'path';
import { showContentMenu } from './menu';

export { sha256sum } from './nodeCrypto';
export { versions } from './versions';
export { ipcRenderer } from 'electron';

const testAvailable = async (): Promise<boolean> => {
  const result = await ipcRenderer.invoke(IPC_EVENTS.AVAILABLE_TEST);
  return result as boolean;
};

export const exposed: ExposedElectron = {
  subscribeLog,
  generateLog,
  getFirstLoadDirectoryTree,
  subscribeDirectoryTree,
  exploreDirectory,
  openContentFile,
  readContentFile,
  executeCommand,
  subscribeCommandCallbackOnFinish,
  testAvailable,
  listWorkspaces: listWorkspaces,
  createWorkspace: createWorkspace,
  openDirectoryForWorkspace,
  dirname: dirname,
  basename: basename,
  join: join,
  unsubscribeLog: unsubscribeLog,
  showContentMenu: showContentMenu,
  searchDirectoryTree: searchDirectoryTree,
};

contextBridge.exposeInMainWorld('electron', exposed);
