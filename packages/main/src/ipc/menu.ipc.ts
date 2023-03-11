import type { WebContents } from 'electron';
import { BrowserWindow, ipcMain, Menu } from 'electron';
import { IPC_EVENTS } from '../../../common/ipc';
import { logger } from '../../../common/logger';
import type { ShowContextMenuRequest } from '../../../common/menu';
import { isMac } from '../const';

ipcMain.on(IPC_EVENTS.CONTEXT_MENU_SHOW, (event, req: ShowContextMenuRequest) => {
  logger.debug('Received CONTEXT_MENU_SHOW', { req });
  let template = [];
  switch (req.type) {
    case 'file-tree-item-directory':
      template = buildMenuForFileTreeItemDirectory(event.sender, req.data);
      break;
    case 'file-tree-item-file':
      template = buildMenuForFileTreeItemFile(event.sender, req.data);
      break;
    default:
      break;
  }

  const menu = Menu.buildFromTemplate(template);
  menu.popup({
    x: req.x,
    y: req.y,
    window: BrowserWindow.fromWebContents(event.sender)!,
  });
});

const buildMenuForFileTreeItemDirectory = (webContents: WebContents, data: any): any => {
  const template = [
    {
      label: isMac ? 'Reveal in Finder' : 'Open folder in Explorer',
      click: () => {
        const { shell } = require('electron');
        shell.openPath(data);
      },
    },
  ];

  return template;
};

const buildMenuForFileTreeItemFile = (webContents: WebContents, data: any): any => {
  const template = [
    {
      label: isMac ? 'Reveal file in Finder' : 'Open file in Explorer',
      click: () => {
        const { shell } = require('electron');
        shell.showItemInFolder(data);
      },
    },
  ];

  return template;
};
