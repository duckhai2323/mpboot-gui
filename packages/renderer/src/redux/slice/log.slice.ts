import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialLogState, LogState } from "../state/log.state";

export const logSlice = createSlice({
    name: 'log',
    initialState: initialLogState,
    reducers: {
        setLogFile: (state, action: PayloadAction<Partial<LogState>>) => {
            if (!action.payload.logFile) {
                return state
            }
            return {
                logData: [],
                logFile: action.payload.logFile
            }
        },
        appendLogData: (state, action: PayloadAction<Partial<LogState>>) => {
            if (!action.payload.logData) {
                return state
            }
            return {
                ...state,
                logData: [
                    ...state.logData,
                    ...action.payload.logData
                ]
            }
        }

    },
});



export const Actions = logSlice.actions;