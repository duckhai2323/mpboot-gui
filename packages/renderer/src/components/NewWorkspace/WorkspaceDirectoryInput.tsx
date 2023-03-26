import React, { useCallback, useRef } from 'react';
import { useElectron } from '../../hooks/useElectron';
import { MButton } from '../common/Button';

export const WorkspaceDirectoryInput = () => {
  const electron = useElectron();
  const workspaceDirFormRef = useRef<HTMLInputElement>(null);

  const onCreateWorkspaceButtonClick = useCallback(
    (_e: any) => {
      (async () => {
        const res = await electron.chooseDirectory();
        if (res.canceled || !res.paths) return;

        if (!workspaceDirFormRef.current) return;
        workspaceDirFormRef.current.value = res.paths[0];
      })();
    },
    [electron, workspaceDirFormRef],
  );

  return (
    <div>
      <label>Workspace directory</label>
      <input
        name="workspaceDir"
        required
        ref={workspaceDirFormRef}
      />
      <MButton onClick={onCreateWorkspaceButtonClick}>Edit</MButton>
    </div>
  );
};
