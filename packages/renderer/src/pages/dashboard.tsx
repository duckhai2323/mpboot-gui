import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IWorkspace } from '../../../common/workspace';
import { MButton } from '../components/common/Button';
import { useElectron } from '../hooks/useElectron';
import { useWorkspace } from '../hooks/useWorkspace';

export const DashboardPage = () => {
  const electron = useElectron();
  const { setWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);

  useEffect(() => {
    electron.listWorkspaces().then(workspaces => {
      setWorkspaces(workspaces);
    });
  }, []);

  const onCreateWorkspaceButtonClick = useCallback((_e: any) => {
    navigate('/new-workspace');
  }, []);

  return (
    <div>
      <span>Dashboard</span>
      <MButton onClick={e => onCreateWorkspaceButtonClick(e)}>Create new workspace</MButton>
      <div>
        {workspaces.map(workspace => {
          return (
            <div key={workspace.id}>
              <span>{workspace.name}</span>
              <MButton
                onClick={_e => {
                  setWorkspace(workspace);
                  navigate('/main');
                }}
              >
                Open
              </MButton>
            </div>
          );
        })}
      </div>
    </div>
  );
};
