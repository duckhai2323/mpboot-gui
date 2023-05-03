import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store/root';
import { useEffect, useRef } from 'react';
import { useElectron } from '../../hooks/useElectron';
import { toast } from 'react-hot-toast';
import { usePhylogenTree } from '../../hooks/usePhylogenTree';
import { Actions } from '../../redux/slice/log.slice';
import type { SaveExecutionHistoryRequest } from '../../../../common/commander';
import { logger } from '../../../../common/logger';

const useGlobalExecution = () => {
  const { execution, workspace } = useSelector((state: RootState) => ({
    execution: state.execution,
    workspace: state.workspace,
  }));
  const electron = useElectron();
  const dispatch = useDispatch();
  const { setNewick } = usePhylogenTree();
  const logTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logDataToFlushRef = useRef<string[]>([]);

  const commandExecutionInfoRef = useRef<SaveExecutionHistoryRequest>({
    fullCommand: '',
    workspaceId: -1,
    seed: -1,
  });

  useEffect(() => {
    try {
      const logStream = electron.subscribeLog(execution.logFile);
      dispatch(
        Actions.setLogFile({
          logFile: execution.logFile,
          logData: [],
        }),
      );
      logStream.on('data', onLogDataDidFire);

      const commandStream = electron.subscribeCommandCallbackOnFinish(
        execution.commandId,
        async result => {
          if (result.isError) {
            toast.error("Command didn't finish successfully");
          } else {
            const treeNewick = (await electron.readContentFile(result.treeFile)).trimEnd();
            setNewick(treeNewick);
            toast.success('Command finished successfully');
            if (!execution.isExecutionHistory) {
              await electron.saveCommandExecution({
                fullCommand: commandExecutionInfoRef.current.fullCommand,
                workspaceId: workspace.id,
                seed: commandExecutionInfoRef.current.seed,
              });
            }
          }
          commandStream.unsubscribe();
        },
      );
      return () => {
        logStream.unregister();
      };
    } catch (err: any) {
      toast.error(err.message);
    }
  }, [execution.commandId]);

  const onLogDataDidFire = (data: string) => {
    const commandHeader = 'Command: ';
    let i = data.indexOf(commandHeader);
    if (i != -1) {
      commandExecutionInfoRef.current.fullCommand = data.slice(
        i + commandHeader.length,
        data.length,
      );
    }
    const seedHeader = 'Seed: ';
    i = data.indexOf(seedHeader);
    if (i != -1) {
      const regexResult = new RegExp('[0-9]+').exec(data);
      if (regexResult == null) {
        logger.error('Seed not found in log file');
      }
      commandExecutionInfoRef.current.seed = parseInt(regexResult![0]);
    }
    if (logTimeoutRef.current) {
      clearTimeout(logTimeoutRef.current);
    }
    logDataToFlushRef.current.push(data);
    logTimeoutRef.current = setTimeout(() => {
      dispatch(
        Actions.appendLogData({
          logData: logDataToFlushRef.current,
        }),
      );
      logDataToFlushRef.current = [];
    }, 100);
  };
};

export const GlobalExecution = () => {
  useGlobalExecution();
  return <></>;
};
