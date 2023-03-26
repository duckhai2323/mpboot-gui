import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
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
      if (result.isError) {
        toast.error("Command didn't finish successfully");
      } else {
        const treeNewick = (await electron.readContentFile(result.treeFile)).trimEnd();
        setNewick(treeNewick);
        toast.success('Command finished successfully');
      }
      commandStream.unsubscribe();
    });
  }, []);

  const isValidTreeFile = useCallback((filePath: string) => {
    const ext = filePath.split('.').pop();
    return ext === 'treefile';
  }, []);

  const setTreeFile = useCallback((filePath: string) => {
    (async () => {
      try {
        if (!isValidTreeFile(filePath)) {
          return;
        }
        const treeNewick = (await electron.readContentFile(filePath)).trimEnd();
        setNewick(treeNewick);
      } catch (err: any) {
        toast.error(err.message);
      }
    })();
  }, []);

  return [setNewick, subscribeCommand, setTreeFile];
};

export const usePhylogenTree = usePhylogenTreeImpl;
