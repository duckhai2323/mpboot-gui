import { logManagerInstance } from '../entity/log-manager';
import { IPC_EVENTS } from '../../../common/ipc';
import { Commander } from '../entity/commander';
import { mpbootExecutablePath } from '../const';
import { wrapperIpcMainHandle, wrapperIpcMainOn } from './common.ipc';

wrapperIpcMainOn(IPC_EVENTS.LOG_SUBSCRIBE, (event, logFile) => {
  if (!logManagerInstance.isValidLogFile(logFile)) {
    return;
  }
  logManagerInstance.subscribeLog(logFile, data => {
    event.sender.send(IPC_EVENTS.LOG_FILE_OF(logFile), data);
  });
});

wrapperIpcMainHandle(IPC_EVENTS.LOG_GENERATE, async (_event, _arg) => {
  const command = new Commander(mpbootExecutablePath, ['--help'], {});
  const result = await command.execute(() => {
    return;
  });
  return result.logFile;
});

wrapperIpcMainOn(IPC_EVENTS.LOG_UNSUBSCRIBE, (_event, logFile) => {
  if (!logManagerInstance.isValidLogFile(logFile)) {
    return;
  }
  logManagerInstance.unsubscribeLog(logFile);
  return;
});
