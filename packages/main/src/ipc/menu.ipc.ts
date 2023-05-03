import type { WebContents } from 'electron';
import { BrowserWindow, Menu } from 'electron';
import { IPC_EVENTS } from '../../../common/ipc';
import type { ShowContextMenuRequest } from '../../../common/menu';
import { is } from '../const';
import { wrapperIpcMainOn } from './common.ipc';

wrapperIpcMainOn(IPC_EVENTS.CONTEXT_MENU_SHOW, (event, req: ShowContextMenuRequest) => {
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
      label: is.mac ? 'Reveal in Finder' : 'Open folder in Explorer',
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
      label: is.mac ? 'Reveal file in Finder' : 'Open file in Explorer',
      click: () => {
        const { shell } = require('electron');
        shell.showItemInFolder(data);
      },
    },
  ];

  return template;
};
