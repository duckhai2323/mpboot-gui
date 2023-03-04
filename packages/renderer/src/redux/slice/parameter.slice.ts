import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { ParameterState } from '../state/parameter.state';
import { initialParameterState } from '../state/parameter.state';

export const parameterSlice = createSlice({
    name: 'parameter',
    initialState: initialParameterState,
    reducers: {
        setParameter: (state, action: PayloadAction<Partial<ParameterState>>) => {
            return {
                ...state,
                ...action.payload,
            };
        },
        resetParameter: (_state) => {
            return initialParameterState;
        },
    },
});



export const Actions = parameterSlice.actions;