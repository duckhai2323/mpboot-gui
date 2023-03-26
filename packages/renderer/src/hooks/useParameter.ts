import { useCallback, useEffect, useReducer } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Actions } from '../redux/slice/parameter.slice';
import type { ParameterState } from '../redux/state/parameter.state';
import { isValidSourceFile } from '../utils/validate';
import { useElectron } from './useElectron';
import { useLog } from './useLog';
import { usePhylogenTree } from './usePhylogenTree';

type MultiSourcesReducerAction = {
  type: 'add' | 'remove' | 'clear';
  payload: string;
};

const multiSourcesReducer = (state: string[], action: MultiSourcesReducerAction) => {
  switch (action.type) {
    case 'add':
      if (!isValidSourceFile(action.payload)) return state;
      return Array.from(new Set(state).add(action.payload).values());
    case 'remove':
      if (!isValidSourceFile(action.payload)) return state;
      return state.filter(e => e !== action.payload);
    case 'clear':
      return [];
    default:
      return state;
  }
};

export const useParameter = (): [
  setSource: (source: string) => void,
  multiSourcesDispatch: React.Dispatch<MultiSourcesReducerAction>,
  setTreefile: (treefile: string) => void,
  executeCommand: (parameter: ParameterState) => void,
  setParameter: (payload: Partial<ParameterState>) => void,
] => {
  const [multiSources, multiSourcesDispatch] = useReducer(multiSourcesReducer, []);
  const dispatch = useDispatch();
  const electron = useElectron();
  const [subscribeLog] = useLog();
  const [, subscribeCommand] = usePhylogenTree();

  const setSource = useCallback((source: string) => {
    dispatch(Actions.setParameter({ source }));
  }, []);

  useEffect(() => {
    dispatch(Actions.setParameter({ multiSources }));
  }, [multiSources]);

  const setTreeFile = useCallback((treefile: string) => {
    dispatch(Actions.setParameter({ treefile }));
  }, []);

  const executeCommand = useCallback(
    async (parameter: ParameterState) => {
      try {
        const { logFile, commandId } = await electron.executeCommand(parameter);
        subscribeLog(logFile);
        subscribeCommand(commandId);
      } catch (err: any) {
        toast.error(err.message);
      }
    },
    [subscribeLog],
  );

  const setParameter = useCallback((payload: Partial<ParameterState>) => {
    dispatch(Actions.setParameter(payload));
  }, []);

  return [setSource, multiSourcesDispatch, setTreeFile, executeCommand, setParameter];
};
