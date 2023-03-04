import { ipcRenderer } from 'electron';
import type { CommandCallbackOnFinishResult, CommandExecuteResult } from '../../common/commander';
import type { Unsubscribe } from '../../common/electron';
import { IPC_EVENTS } from '../../common/ipc';
import type { Parameter } from '../../common/parameter';

export const executeCommand = async (param: Parameter): Promise<CommandExecuteResult> => {
  const result = await ipcRenderer.invoke(IPC_EVENTS.COMMAND_EXECUTE, param);
  return result as CommandExecuteResult;
};

export const subscribeCommandCallbackOnFinish = (
  commandId: string,
  callback: (result: CommandCallbackOnFinishResult) => void,
): Unsubscribe => {
  ipcRenderer.on(IPC_EVENTS.COMMAND_CALLBACK_ON_FINISH(commandId), (event, result) => {
    callback(result);
  });
  return {
    unsubscribe: () => {
      ipcRenderer.removeAllListeners(IPC_EVENTS.COMMAND_CALLBACK_ON_FINISH(commandId));
    },
  };
};
