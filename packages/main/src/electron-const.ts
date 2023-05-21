import { app } from 'electron';
import { join } from 'path';

const userDataPath = app.getPath('userData');
export const dbPath = join(userDataPath, 'mpboot-gui.sqlite');
export const binaryPath = join(userDataPath, 'binary');

export const binaryPathFor = (versionId: string) => join(binaryPath, versionId);
export const configPath = join(userDataPath, 'config.json');
