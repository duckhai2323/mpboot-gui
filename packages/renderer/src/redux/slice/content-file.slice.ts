import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentFileState, initialContentFileState } from "../state/content-file.state";

export const contentFileSlice = createSlice({
    name: 'content-file',
    initialState: initialContentFileState,
    reducers: {
        setContentFile: (state, action: PayloadAction<Partial<ContentFileState>>) => {
            return {
                ...state,
                ...action.payload
            }
        },
        openFile: (state, action: PayloadAction<Partial<ContentFileState>>) => {
            if (!action.payload.path || !action.payload.name) {
                return state
            }
            return {
                path: action.payload.path,
                name: action.payload.name,
            }
        }

    },
});



export const Actions = contentFileSlice.actions;