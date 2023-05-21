import { writeFile } from 'fs/promises';
import { readFileSync } from 'fs';
import { configPath } from './electron-const';

interface InAppVersion {
  version: string;
  fullPath: string;
  os: string;
}
export type MPBootInstallation = 'in-app' | 'pre-installed';
export interface Configuration {
  mpboot: {
    installation: MPBootInstallation;
    inAppVersions?: InAppVersion[];
    currentPath?: string;
    currentVersion?: string;
  };
}

export const saveConfiguration = async (config: Configuration) => {
  await writeFile(configPath, JSON.stringify(config, null, 2));
  globalConfig = config;
};

const loadConfiguration = (): Configuration => {
  try {
    const config = readFileSync(configPath, { encoding: 'utf-8' });
    return JSON.parse(config) as Configuration;
  } catch (err) {
    writeFile(configPath, JSON.stringify(defaultConfiguration, null, 2));
    return defaultConfiguration;
  }
};

const defaultConfiguration: Configuration = {
  mpboot: {
    installation: 'pre-installed',
    currentPath: 'mpboot',
  },
};

export let globalConfig = loadConfiguration();
