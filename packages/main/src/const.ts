import { app } from 'electron';
import { join } from 'path';

export const userDataPath = app.getPath('userData');
export const dbPath = join(userDataPath, 'mpboot-gui.sqlite');
export const mpbootExecutablePath = 'mpboot';
export const pageUrl =
import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
  ? import.meta.env.VITE_DEV_SERVER_URL
  :
  new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();
