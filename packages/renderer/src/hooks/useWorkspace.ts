import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { IWorkspace } from '../../../common/workspace';
import { Actions } from '../redux/slice/workspace.slice';
import type { RootState } from '../redux/store/root';
import { Actions as ContentFileAction } from '../redux/slice/content-file.slice';
export const useWorkspace = (): [
  projectPath: string,
  getRelativePath: (path: string) => string,
  setWorkspace: (ws: IWorkspace) => void,
] => {
  const workspaceState = useSelector((state: RootState) => state.workspace);
  const dispatch = useDispatch();
  const workspacePath = workspaceState.dirPath;

  const getRelativePath = useCallback(
    (path: string) => {
      const relativePath = path.replace(workspacePath, '.');
      return relativePath;
    },
    [workspacePath],
  );

  const setWorkspace = useCallback((ws: IWorkspace) => {
    dispatch(ContentFileAction.clear());
    dispatch(Actions.setWorkspace({ dirPath: ws.path, name: ws.name, id: ws.id }));
  }, []);

  return [workspacePath, getRelativePath, setWorkspace];
};
