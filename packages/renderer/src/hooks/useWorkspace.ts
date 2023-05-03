import { useDispatch } from 'react-redux';
import type { IWorkspace } from '../../../common/workspace';
import { Actions as WorkspaceAction } from '../redux/slice/workspace.slice';
import { Actions as ContentFileAction } from '../redux/slice/content-file.slice';
export const useWorkspace = (): {
  getRelativePath: (path: string, wsPath: string) => string;
  setWorkspace: (ws: IWorkspace) => void;
} => {
  const dispatch = useDispatch();

  const getRelativePath = (path: string, wsPath: string) => {
    const relativePath = path.replace(wsPath, '.');
    return relativePath;
  };

  const setWorkspace = (ws: IWorkspace) => {
    dispatch(ContentFileAction.clear());
    dispatch(WorkspaceAction.setWorkspace({ dirPath: ws.path, name: ws.name, id: ws.id }));
  };

  return { getRelativePath, setWorkspace };
};
