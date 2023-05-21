import type { MPBootSource } from './common/type';
import { default as env } from './inject-env';
export const preInstalledMpbootExecutable = 'mpboot';

export const pageUrl =
  import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

export const isDevEnv = import.meta.env.DEV;
export const is = {
  mac: process.platform === 'darwin',
  win: process.platform === 'win32',
  linux: process.platform === 'linux',
};

export const githubToken = env.PUBLIC_GITHUB_TOKEN;

export const mpbootSource: MPBootSource = {
  gitProvider: 'github',
  gitOwner: 'aqaurius6666',
  gitRepoName: 'mpboot',
};
