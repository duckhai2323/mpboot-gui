import { useCallback, useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { Actions } from '../redux/slice/parameter.slice';
import { isValidSourceFile } from '../utils/validate';

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
  (source: string) => void,
  React.Dispatch<MultiSourcesReducerAction>,
] => {
  const [multiSources, multiSourcesDispatch] = useReducer(multiSourcesReducer, []);
  const dispatch = useDispatch();

  const setSource = useCallback((source: string) => {
    dispatch(Actions.setParameter({ source }));
  }, []);

  useEffect(() => {
    dispatch(Actions.setParameter({ multiSources }));
  }, [multiSources]);

  return [setSource, multiSourcesDispatch];
};
