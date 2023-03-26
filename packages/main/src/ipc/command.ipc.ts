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
import { wrapperIpcMainHandle } from './common.ipc';

wrapperIpcMainHandle(
  IPC_EVENTS.COMMAND_EXECUTE,
  async (event, param: Parameter): Promise<CommandExecuteResult> => {
    const args = convertParameterToCommandArgs(param);
    const commandId = randomUUID();
    const command = new MPBootCommander(mpbootExecutablePath, args, {});
    const result = await command.execute(exitCode => {
      logger.debug('exit code', exitCode);
      const data: CommandCallbackOnFinishResult = {
        treeFile: command.generatedTreeFilePath,
        isError: exitCode !== 0,
      };
      event.sender.send(IPC_EVENTS.COMMAND_CALLBACK_ON_FINISH(commandId), data);
      logger.debug('Sent COMMAND_CALLBACK_ON_FINISH', { commandId });
    });
    return {
      logFile: result.logFile,
      commandId,
    };
  },
);

wrapperIpcMainHandle(IPC_EVENTS.AVAILABLE_TEST, async () => {
  const command = new WhichCommander(mpbootExecutablePath);
  try {
    return await command.test();
  } catch (err: any) {
    logger.error('Failed to test mpboot executable', err);
    return false;
  }
});
