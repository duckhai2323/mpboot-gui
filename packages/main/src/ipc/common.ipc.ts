import type { IpcMainInvokeEvent } from 'electron';
import { ipcMain } from 'electron';
import { logger } from '../../../common/logger';

export const wrapperIpcMainHandle = (
  ipcName: string,
  listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<void> | any,
) => {
  ipcMain.handle(ipcName, async (event, ...args) => {
    try {
      logger.debug(`Received ${ipcName}`, args);
      return await listener(event, ...args);
    } catch (err: any) {
      logger.error(`Error when calling ${ipcName}`, err);
      throw new Error('Error when calling ' + ipcName);
    }
  });
};

export const wrapperIpcMainOn = (
  ipcName: string,
  listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<void> | any,
) => {
  ipcMain.on(ipcName, async (event, ...args) => {
    try {
      logger.debug(`Received ${ipcName}`, args);
      return await listener(event, ...args);
    } catch (err: any) {
      logger.error(`Error when calling ${ipcName}`, err);
      throw new Error('Error when calling ' + ipcName);
    }
  });
};
