import { app, Menu } from 'electron';
import { is, pageUrl } from './const';
import { restoreOrCreateWindow } from './mainWindow';
import { MPBootSubMenu } from './mpboot-installation';

const template = [
  //   { role: 'appMenu' }
  ...(is.mac
    ? [
        {
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      {
        label: 'Dashboard',
        click: async () => {
          const window = await restoreOrCreateWindow();
          await window.loadURL(pageUrl + '#/dashboard');
        },
      },
      is.mac ? { role: 'close' } : { role: 'quit' },
    ],
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(is.mac
        ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
            },
          ]
        : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
    ],
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(is.mac
        ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
        : [{ role: 'close' }]),
    ],
  },
  {
    role: 'help',
    submenu: [
      MPBootSubMenu,
      {
        label: 'Check for updates',
        click: async () => {
          const { autoUpdater } = require('electron-updater');
          autoUpdater.checkForUpdatesAndNotify();
        },
      },
      {
        label: 'Open developer tools',
        click: async () => {
          const window = await restoreOrCreateWindow();
          window?.webContents.openDevTools();
        },
      },
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('http://www.iqtree.org/mpboot/');
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template as any);
Menu.setApplicationMenu(menu);
