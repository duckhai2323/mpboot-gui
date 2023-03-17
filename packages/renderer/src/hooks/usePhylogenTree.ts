import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Actions } from '../redux/slice/phylogen-tree.slice';
import { useElectron } from './useElectron';

const usePhylogenTreeImpl = (): [
  setNewick: (str: string) => void,
  subscribeCommand: (id: string) => void,
  setTreeFile: (filePath: string) => void,
] => {
  const dispatch = useDispatch();
  const electron = useElectron();

  const setNewick = useCallback((newick: string) => {
    dispatch(Actions.setNewick(newick));
  }, []);

  const subscribeCommand = useCallback((commandId: string) => {
    const commandStream = electron.subscribeCommandCallbackOnFinish(commandId, async result => {
      const treeNewick = (await electron.readContentFile(result.treeFile)).trimEnd();
      setNewick(treeNewick);
      commandStream.unsubscribe();
    });
  }, []);

  const isValidTreeFile = useCallback((filePath: string) => {
    const ext = filePath.split('.').pop();
    return ext === 'treefile';
  }, []);

  const setTreeFile = useCallback((filePath: string) => {
    if (!isValidTreeFile(filePath)) {
      return;
    }
    (async () => {
      const treeNewick = (await electron.readContentFile(filePath)).trimEnd();
      setNewick(treeNewick);
    })();
  }, []);

  return [setNewick, subscribeCommand, setTreeFile];
};

export const usePhylogenTree = usePhylogenTreeImpl;
