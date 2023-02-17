import { ipcMain } from 'electron';
import { logManagerInstance } from '../entity/log-manager';
import { IPC_EVENTS } from '../../../common/ipc';
import { Commander } from '../entity/commander';

ipcMain.on(IPC_EVENTS.SUBSCRIBE_LOG_CHANNEL, (event, logFile) => {
  logManagerInstance.subscribeLog(logFile, data => {
    event.sender.send(IPC_EVENTS.LOG_CHANNEL(logFile), data);
  });
});

ipcMain.handle(IPC_EVENTS.GENERATE_LOG_CHANNEL, async (_event, _arg) => {
  const command = new Commander('yarn', ['start:debug'], {
    cwd: '/Users/aqaurius6666/codes/mfi/win',
  });
  const result = await command.execute();
  return result.logFile;
});
