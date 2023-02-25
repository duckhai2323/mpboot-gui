import { ipcMain } from 'electron';
import { logManagerInstance } from '../entity/log-manager';
import { IPC_EVENTS } from '../../../common/ipc';
import { Commander } from '../entity/commander';
import { logger } from '../../../common/logger';

ipcMain.on(IPC_EVENTS.LOG_SUBSCRIBE, (event, logFile) => {
  logger.log('Received LOG_SUBSCRIBE', { logFile });
  logManagerInstance.subscribeLog(logFile, data => {
    event.sender.send(IPC_EVENTS.LOG_FILE_OF(logFile), data);
  });
});

ipcMain.handle(IPC_EVENTS.LOG_GENERATE, async (_event, _arg) => {
  const command = new Commander('/Users/aqaurius6666/Downloads/build/mpboot', ['--help'], {
  });
  const result = await command.execute(() => {return;});
  return result.logFile;
});
