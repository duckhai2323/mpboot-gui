import type { SideBarState } from './../state/item_menu.state';
import { createSlice } from '@reduxjs/toolkit';
import { initialSidebarState } from '../state/item_menu.state';
import type { PayloadAction } from '@reduxjs/toolkit';

export const SidebarStateSlice = createSlice({
  name: 'sidebar-state',
  initialState: initialSidebarState,
  reducers: {
    setItemMenu: (state, action: PayloadAction<SideBarState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    setOpenSidebar: (state, action: PayloadAction<SideBarState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const Actions = SidebarStateSlice.actions;
