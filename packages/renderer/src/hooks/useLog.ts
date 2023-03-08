import { useCallback, useDebugValue, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { singletonHook } from 'react-singleton-hook';
import { Actions } from '../redux/slice/log.slice';
import type { LogState } from '../redux/state/log.state';
import type { RootState } from '../redux/store/root';
import { useElectron } from './useElectron';
const unimplementedUseLog = (): [
  logData: string[],
  setLogFile: (filePath: string) => void,
  reloadLog: () => void,
] => {
  return [
    [],
    (_filePath: string) => {
      return;
    },
    () => {
      return;
    },
  ];
};
const useLogImpl = (): [
  logData: string[],
  setLogFile: (filePath: string) => void,
  reloadLog: () => void,
] => {
  const logState = useSelector((state: RootState) => state.log);
  const dispatch = useDispatch();
  const electron = useElectron();
  const [counter, setCounter] = useState(0);
  const [dataToBeFlushed, setDataToBeFlushed] = useState<string[]>([]);

  /**
   * Render whenever log file changes
   */
  useEffect(() => {
    const logStream = electron.subscribeLog(logState.logFile);
    logStream.on('data', (data: string) => {
      dispatch(
        Actions.appendLogData({
          logData: [data],
        }),
      );
    });
    return () => {
      logStream.unregister();
    };
  }, [logState.logFile, counter]);

  /**
   * Flush data to redux store after 250ms of inactivity
   */
  // useEffect(() => {
  //   if (dataToBeFlushed.length === 0) {
  //     return;
  //   }
  //   const timeout = setTimeout(() => {
  //     dispatch(
  //       Actions.appendLogData({
  //         logData: dataToBeFlushed,
  //       }),
  //     );
  //     setDataToBeFlushed([]);
  //   }, 250);
  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [dataToBeFlushed]);

  // const onLogStreamEvent = useCallback((data: string) => {
  //   setDataToBeFlushed(d => [...d, data]);
  // }, []);

  // useEffect(() => {
  //   const logStream = electron.subscribeLog(logState.logFile);
  //   logStream.on('data', onLogStreamEvent);
  //   return () => {
  //     logStream.unregister();
  //   };
  // }, [logState.logFile, counter]);

  const reloadLog = useCallback(async () => {
    electron.unsubscribeLog(logState.logFile);
    dispatch(
      Actions.setLogFile({
        logFile: logState.logFile,
        logData: [],
      }),
    );
    setCounter(c => c + 1);
  }, [logState.logFile]);

  const setLogFile = useCallback((filePath: string) => {
    dispatch(
      Actions.setLogFile({
        logFile: filePath,
      }),
    );
  }, []);
  
  const logData = useMemo(() => logState.logData, [logState.logData.length])

  return [logData, setLogFile, reloadLog];
};

export const useLog = singletonHook(unimplementedUseLog, useLogImpl);
