/**
 * @module preload
 */

import { contextBridge } from 'electron';
import type { ExposedElectron } from '../../common/electron';
import { generateLog, subscribeLog } from './log';
import { executeCommand, subscribeCommandCallbackOnFinish } from './command';
import { openContentFile, readContentFile } from './content-file';
import { getFirstLoadDirectoryTree, subscribeDirectoryTree, exploreDirectory } from './directory-tree';

export { sha256sum } from './nodeCrypto';
export { versions } from './versions';
export { ipcRenderer } from 'electron';

const testAvailable = (): boolean => {
  return true;
};

const exposed: ExposedElectron = {
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
};

contextBridge.exposeInMainWorld('electron', exposed);
