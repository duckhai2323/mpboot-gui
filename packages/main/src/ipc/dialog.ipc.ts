import type { OpenDialogOptions } from 'electron';
import { dialog } from 'electron';
import { IPC_EVENTS } from '../../../common/ipc';
import type { DialogChooseDirectoryOrFileResult } from '../../../common/workspace';
import { wrapperIpcMainHandle } from './common.ipc';
import { is } from '../const';

wrapperIpcMainHandle(
  IPC_EVENTS.DIALOG_CHOOSE_DIRECTORY,
  async (_event): Promise<DialogChooseDirectoryOrFileResult> => {
    const results = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
      message: 'Choose one directory as workspace folder',
      title: 'Choose one directory as workspace folder',
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
    const options: OpenDialogOptions = is.mac
      ? {
          properties: ['openDirectory', 'multiSelections', 'openFile'],
          title: 'Choose one (or more) directory, file as input data for workspace',
          message: 'Choose one (or more) directory, file as input data for workspace',
        }
      : {
          properties: ['multiSelections', 'openFile'],
          title: 'Choose one (or more) file as input data for workspace',
        };
    const results = await dialog.showOpenDialog(options);
    return {
      canceled: results.canceled,
      paths: results.filePaths,
    };
  },
);
