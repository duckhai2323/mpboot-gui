import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialProjectState, ProjectState } from "../state/project.state";

export const projectSlice = createSlice({
    name: 'project',
    initialState: initialProjectState,
    reducers: {
        setProject: (state, action: PayloadAction<Partial<ProjectState>>) => {
            return {
                ...state,
                ...action.payload
            }
        }
    },
});



export const Actions = projectSlice.actions;