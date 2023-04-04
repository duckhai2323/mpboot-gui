import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useElectron } from '../../hooks/useElectron';
import { useWorkspace } from '../../hooks/useWorkspace';
import { MButton } from '../common/Button';
import { WorkspaceDirectoryInput } from './WorkspaceDirectoryInput';
import { WorkspaceInputDataInput } from './WorkspaceInputDataInput';
import { WorkspaceNameInput } from './WorkspaceNameInput';

export type NewWorkspaceData = {
  workspaceDirPath: string;
  workspaceName: string;
  inputData?: NewWorkspaceInputData[];
};
export type NewWorkspaceInputData = {
  refName: string;
  inputPath: string;
  type: 'file' | 'directory';
};

export const NewWorkspace = () => {
  const [, setWorkspace] = useWorkspace();
  const navigate = useNavigate();

  const electron = useElectron();
  const onFormSubmit = useCallback(
    (e: any) => {
      e.preventDefault();
      (async () => {
        try {
          const elements = e.target.elements;
          const workspace: NewWorkspaceData = {} as NewWorkspaceData;
          workspace.workspaceDirPath = elements.workspaceDir.value;
          workspace.workspaceName = elements.workspaceName.value;
          workspace.inputData = [];
          if (!elements.inputData?.length) {
            if (elements.inputData.value) {
              const inputData = JSON.parse(elements.inputData.value);
              workspace.inputData?.push(inputData);
            }
          } else {
            for (let i = 0; i < elements.inputData?.length || 0; i++) {
              const inputData = JSON.parse(elements.inputData[i].value);
              workspace.inputData?.push(inputData);
            }
          }
          const ws = await electron.createWorkspace({
            inputData: workspace.inputData,
            path: workspace.workspaceDirPath,
            name: workspace.workspaceName,
          });
          setWorkspace(ws);
          navigate('/main');
        } catch (err: any) {
          toast.error(err.message);
        }
      })();
    },
    [navigate],
  );

  return (
    <>
      <div>Dashboard</div>
      <div>
        <form onSubmit={onFormSubmit}>
          <WorkspaceDirectoryInput />
          <WorkspaceNameInput />
          <WorkspaceInputDataInput />
          <div>
            <MButton type="submit">Create</MButton>
          </div>
        </form>
      </div>
    </>
  );
};
