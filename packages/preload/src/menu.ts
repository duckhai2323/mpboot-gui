import { ipcRenderer } from 'electron';
import { IPC_EVENTS } from '../../common/ipc';
import type { ShowContextMenuRequest } from '../../common/menu';

export const showContentMenu = (req: ShowContextMenuRequest) => {
  ipcRenderer.send(IPC_EVENTS.CONTEXT_MENU_SHOW, req);
  return;
};
