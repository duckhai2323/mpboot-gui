import type { IpcRendererEvent } from 'electron';
import { ipcRenderer } from 'electron';
import EventEmitter from 'events';
import type { Directory, DirectoryTreeEvent } from '../../common/directory-tree';
import type { CustomEventEmitter } from '../../common/electron';
import { IPC_EVENTS } from '../../common/ipc';

export const getFirstLoadDirectoryTree = async (dirPath: string): Promise<Directory> => {
  const result = await ipcRenderer.invoke(IPC_EVENTS.DIRECTORY_TREE_FIRST_LOAD, dirPath);
  return result as Directory;
};

export const subscribeDirectoryTree = (dirPath: string): CustomEventEmitter => {
  const emitter = new EventEmitter();
  ipcRenderer.send(IPC_EVENTS.DIRECTORY_TREE_SUBSCRIBE, dirPath);
  const onChangeOfDirectoryEvent = (_: IpcRendererEvent, events: DirectoryTreeEvent[]) => {
    emitter.emit('data', events);
  };
  ipcRenderer.on(IPC_EVENTS.DIRECTORY_TREE_CHANGE_OF(dirPath), onChangeOfDirectoryEvent);
  return {
    on: (event, callback) => {
      emitter.on(event, callback);
    },
    unregister: () => {
      emitter.removeAllListeners();
      ipcRenderer.off(IPC_EVENTS.DIRECTORY_TREE_CHANGE_OF(dirPath), onChangeOfDirectoryEvent);
    },
  };
};

export const exploreDirectory = async (
  dirPath: string,
  dirToExplore: string,
): Promise<Directory> => {
  const result = await ipcRenderer.invoke(IPC_EVENTS.DIRECTORY_TREE_EXPLORE_DIRECTORY, {
    dirPath,
    dirToExplore,
  });
  return result as Directory;
};
