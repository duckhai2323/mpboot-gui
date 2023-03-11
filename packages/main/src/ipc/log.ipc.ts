import { ipcMain } from 'electron';
import { logManagerInstance } from '../entity/log-manager';
import { IPC_EVENTS } from '../../../common/ipc';
import { Commander } from '../entity/commander';
import { logger } from '../../../common/logger';
import { mpbootExecutablePath } from '../const';

ipcMain.on(IPC_EVENTS.LOG_SUBSCRIBE, (event, logFile) => {
  logger.debug('Received LOG_SUBSCRIBE', { logFile });
  if (!logManagerInstance.isValidLogFile(logFile)) {
    return;
  }
  logManagerInstance.subscribeLog(logFile, data => {
    event.sender.send(IPC_EVENTS.LOG_FILE_OF(logFile), data);
  });
});

ipcMain.handle(IPC_EVENTS.LOG_GENERATE, async (_event, _arg) => {
  logger.debug('Received LOG_GENERATE');
  const command = new Commander(mpbootExecutablePath, ['--help'], {});
  const result = await command.execute(() => {
    return;
  });
  return result.logFile;
});

ipcMain.on(IPC_EVENTS.LOG_UNSUBSCRIBE, (_event, logFile) => {
  logger.debug('Received LOG_UNSUBSCRIBE', { logFile });
  if (!logManagerInstance.isValidLogFile(logFile)) {
    return;
  }
  logManagerInstance.unsubscribeLog(logFile);
  return;
});
