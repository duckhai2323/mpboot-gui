import { dialog } from 'electron';
import { IPC_EVENTS } from '../../../common/ipc';
import type { DialogChooseDirectoryOrFileResult } from '../../../common/workspace';
import { wrapperIpcMainHandle } from './common.ipc';

wrapperIpcMainHandle(
  IPC_EVENTS.DIALOG_CHOOSE_DIRECTORY,
  async (_event): Promise<DialogChooseDirectoryOrFileResult> => {
    const results = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
    });
    return {
      canceled: results.canceled,
      paths: results.filePaths,
    };
  },
);

wrapperIpcMainHandle(
  IPC_EVENTS.DIALOG_CHOOSE_DIRECTORY_OR_FILE,
  async (_event): Promise<DialogChooseDirectoryOrFileResult> => {
    const results = await dialog.showOpenDialog({
      properties: ['openDirectory', 'openFile', 'multiSelections'],
    });
    return {
      canceled: results.canceled,
      paths: results.filePaths,
    };
  },
);
