import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { ExecutionState } from '../state/execution.state';
import { initialExecutionState } from '../state/execution.state';

export const executionSlice = createSlice({
  name: 'execution',
  initialState: initialExecutionState,
  reducers: {
    setExecution: (state, action: PayloadAction<Partial<ExecutionState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetExecution: () => {
      return initialExecutionState;
    },
  },
});

export const Actions = executionSlice.actions;
