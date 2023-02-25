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
};

contextBridge.exposeInMainWorld('electron', exposed);
