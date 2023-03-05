import type { IpcRendererEvent } from 'electron';
import { ipcRenderer } from 'electron';
import { EventEmitter } from 'events';
import type { CustomEventEmitter } from '../../common/electron';
import { IPC_EVENTS } from '../../common/ipc';

export const subscribeLog = (logFile: string): CustomEventEmitter => {
  const emitter = new EventEmitter();
  ipcRenderer.send(IPC_EVENTS.LOG_SUBSCRIBE, logFile);
  const onLogListener = (_: IpcRendererEvent, data: any) => {
    emitter.emit('data', data);
  };
  ipcRenderer.on(IPC_EVENTS.LOG_FILE_OF(logFile), onLogListener);

  return {
    on: (event, callback) => {
      emitter.on(event, callback);
    },
    unregister: () => {
      emitter.removeAllListeners();
      ipcRenderer.off(IPC_EVENTS.LOG_FILE_OF(logFile), onLogListener);
    },
  };
};

export const generateLog = () => {
  return ipcRenderer.invoke(IPC_EVENTS.LOG_GENERATE);
};

export const unsubscribeLog = (logFile: string) => {
  ipcRenderer.send(IPC_EVENTS.LOG_UNSUBSCRIBE, logFile);
};
