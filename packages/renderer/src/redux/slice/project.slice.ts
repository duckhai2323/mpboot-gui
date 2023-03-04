import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { ProjectState } from '../state/project.state';
import { initialProjectState } from '../state/project.state';

export const projectSlice = createSlice({
    name: 'project',
    initialState: initialProjectState,
    reducers: {
        setProject: (state, action: PayloadAction<Partial<ProjectState>>) => {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});



export const Actions = projectSlice.actions;