import { ipcRenderer } from 'electron';
import type {
  CommandCallbackOnFinishResult,
  ExecuteCommandResponse,
  SaveExecutionHistoryRequest,
  LoadExecutionHistoryRequest,
  LoadExecutionHistoryResponse,
  ExecuteCommandRequest,
} from '../../common/commander';
import type { Unsubscribe } from '../../common/electron';
import { IPC_EVENTS } from '../../common/ipc';

export const executeCommand = async (
  req: ExecuteCommandRequest,
): Promise<ExecuteCommandResponse> => {
  const result = await ipcRenderer.invoke(IPC_EVENTS.COMMAND_EXECUTE, req);
  return result as ExecuteCommandResponse;
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

export const saveCommandExecution = async (req: SaveExecutionHistoryRequest): Promise<boolean> => {
  return await ipcRenderer.invoke(IPC_EVENTS.COMMAND_SAVE_EXECUTION, req);
};

export const loadExecutionHistory = async (
  req: LoadExecutionHistoryRequest,
): Promise<LoadExecutionHistoryResponse> => {
  return await ipcRenderer.invoke(IPC_EVENTS.COMMAND_LOAD_EXECUTION, req);
};
