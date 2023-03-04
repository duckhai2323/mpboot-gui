import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../redux/slice/content-file.slice';
import type { ContentFileState } from '../redux/state/content-file.state';
import type { RootState } from '../redux/store/root';
import { useElectron } from './useElectron';

export const useContentView = (): [ContentFileState, (filePath: string) => void] => {
  const contentFile = useSelector((state: RootState) => state.contentFile);
  const dispatch = useDispatch();
  const electron = useElectron();

  const openFile = useCallback(
    async (filePath: string) => {
      const contentFile = await electron.openContentFile(filePath);
      const content = await electron.readContentFile(filePath);
      dispatch(
        Actions.setContentFile({
          name: contentFile.fileName,
          path: contentFile.filePath,
          content,
        }),
      );
    },
    [dispatch, electron, contentFile.path],
  );

  return [contentFile, openFile];
};
