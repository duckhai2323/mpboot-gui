import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { WorkspaceState } from '../state/workspace.state';
import { initialWorkspaceState } from '../state/workspace.state';

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: initialWorkspaceState,
  reducers: {
    setWorkspace: (state, action: PayloadAction<Partial<WorkspaceState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const Actions = workspaceSlice.actions;
