import { useCallback } from 'react';
import { Actions } from '../redux/slice/content-file.slice';
import { useElectron } from './useElectron';
import { useDispatch } from 'react-redux';

export const useContentView = (): [
  openFile: (filePath: string) => void,
  notifyContentFileChange: (filePath: string, data: string) => void,
] => {
  const dispatch = useDispatch();
  const electron = useElectron();

  const openFile = useCallback(async (filePath: string) => {
    const contentFile = await electron.openContentFile(filePath);
    const content = await electron.readContentFile(filePath);
    dispatch(
      Actions.setContentFile({
        name: contentFile.fileName,
        path: contentFile.filePath,
        content,
      }),
    );
  }, []);

  const notifyContentFileChange = useCallback((filePath: string, data: string) => {
    dispatch(
      Actions.setContentFileOnlyMatchPath({
        content: data,
        path: filePath,
      }),
    );
  }, []);

  return [openFile, notifyContentFileChange];
};
