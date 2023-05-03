import { useCallback } from 'react';
import { Actions } from '../redux/slice/content-file.slice';
import { useElectron } from './useElectron';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

export const useContentView = (): {
  openFile: (filePath: string) => void;
  notifyContentFileChange: (filePath: string, data: string) => void;
} => {
  const dispatch = useDispatch();
  const electron = useElectron();

  const openFile = useCallback(async (filePath: string) => {
    try {
      const contentFile = await electron.openContentFile(filePath);
      const content = await electron.readContentFile(filePath);
      dispatch(
        Actions.setContentFile({
          name: contentFile.fileName,
          path: contentFile.filePath,
          content,
        }),
      );
    } catch (err: any) {
      toast.error(err.message);
    }
  }, []);

  const notifyContentFileChange = useCallback((filePath: string, data: string) => {
    dispatch(
      Actions.setContentFileOnlyMatchPath({
        content: data,
        path: filePath,
      }),
    );
  }, []);

  return { openFile, notifyContentFileChange };
};
