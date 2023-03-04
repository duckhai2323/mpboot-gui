import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { singletonHook } from 'react-singleton-hook';
import { Actions } from '../redux/slice/phylogen-tree.slice';
import type { RootState } from '../redux/store/root';
import { useElectron } from './useElectron';

const initialUsePhylogenTree = (): [
  newick: string,
  setNewick: (str: string) => void,
  subscribeCommand: (id: string) => void,
] => {
  return [
    '',
    (_str: string) => {
      return;
    },
    (_id: string) => {
      return;
    },
  ];
};

const usePhylogenTreeImpl = (): [
  newick: string,
  setNewick: (str: string) => void,
  subscribeCommand: (id: string) => void,
] => {
  const phylogenTree = useSelector((state: RootState) => state.phylogenTree);
  const dispatch = useDispatch();
  const electron = useElectron();

  const setNewick = useCallback((newick: string) => {
    dispatch(Actions.setNewick(newick));
  }, []);

  const newick = useMemo(() => phylogenTree.newick, [phylogenTree]);

  const subscribeCommand = useCallback(
    (commandId: string) => {
      const commandStream = electron.subscribeCommandCallbackOnFinish(commandId, async result => {
        const treeNewick = (await electron.readContentFile(result.treeFile)).trimEnd();
        setNewick(treeNewick);
        commandStream.unsubscribe();
      });
    },
    [electron],
  );

  return [newick, setNewick, subscribeCommand];
};

export const usePhylogenTree = singletonHook(initialUsePhylogenTree, usePhylogenTreeImpl);
