import { ipcMain } from 'electron';
import { IPC_EVENTS } from '../../../common/ipc';
import type { Parameter } from '../../../common/parameter';
import { convertParameterToCommandArgs } from '../../../common/parameter';
import { logger } from '../../../common/logger';
import { randomUUID } from 'crypto';
import type {
  CommandCallbackOnFinishResult,
  CommandExecuteResult,
} from '../../../common/commander';
import { MPBootCommander } from '../entity/mpboot-commander';
import { mpbootExecutablePath } from '../const';
import { WhichCommander } from '../entity/which-commander';

ipcMain.handle(
  IPC_EVENTS.COMMAND_EXECUTE,
  async (event, param: Parameter): Promise<CommandExecuteResult> => {
    logger.debug('Received COMMAND_EXECUTE', { param });
    const args = convertParameterToCommandArgs(param);
    const commandId = randomUUID();
    const command = new MPBootCommander(mpbootExecutablePath, args, {});
    const result = await command.execute(() => {
      const data: CommandCallbackOnFinishResult = {
        treeFile: command.generatedTreeFilePath,
      };
      event.sender.send(IPC_EVENTS.COMMAND_CALLBACK_ON_FINISH(commandId), data);
    });
    return {
      logFile: result.logFile,
      commandId,
    };
  },
);

ipcMain.handle(IPC_EVENTS.AVAILABLE_TEST, async () => {
  logger.debug('Received AVAILABLE_TEST');
  const command = new WhichCommander(mpbootExecutablePath);
  try {
    return await command.test();
  } catch (err: any) {
    logger.error('Failed to test mpboot executable', err);
    return false;
  }
});
