/**
 * @module preload
 */

import type { IpcRendererEvent } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';
import { EventEmitter } from 'stream';
import type { ExposedElectron } from '../../common/electron';
import { IPC_EVENTS } from '../../common/ipc';

export { sha256sum } from './nodeCrypto';
export { versions } from './versions';
export { ipcRenderer } from 'electron';

const exposed: ExposedElectron = {
  subscribeLog: logFile => {
    const emitter = new EventEmitter();
    ipcRenderer.send(IPC_EVENTS.SUBSCRIBE_LOG_CHANNEL, logFile);
    const onLogListener = (_: IpcRendererEvent, data: any) => {
      emitter.emit('data', data);
    };
    ipcRenderer.on(IPC_EVENTS.LOG_CHANNEL(logFile), onLogListener);

    return {
      on: (event, callback) => {
        emitter.on(event, callback);
      },
      unregister: () => {
        emitter.removeAllListeners();
        ipcRenderer.off(IPC_EVENTS.LOG_CHANNEL(logFile), onLogListener);
      },
    };
  },
  generateLog: () => {
    return ipcRenderer.invoke(IPC_EVENTS.GENERATE_LOG_CHANNEL);
  },
};

contextBridge.exposeInMainWorld('electron', exposed);
