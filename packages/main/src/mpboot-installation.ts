import { IPC_EVENTS } from '../../common/ipc';
import { restoreOrCreateWindow } from './mainWindow';

export const MPBootSubMenu = {
  label: 'MPBoot installation',
  click: async () => {
    const window = await restoreOrCreateWindow();
    window?.webContents.send(IPC_EVENTS.INSTALLATION_OPEN);
  },
};
