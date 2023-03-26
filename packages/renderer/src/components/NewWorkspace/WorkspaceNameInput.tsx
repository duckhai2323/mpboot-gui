import React from 'react';

export const WorkspaceNameInput = () => {
  return (
    <div>
      <label>Workspace name</label>
      <input
        required
        name="workspaceName"
      />
    </div>
  );
};
