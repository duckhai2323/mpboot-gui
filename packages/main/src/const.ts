import type { MPBootSource } from './common/type';

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

export const githubToken =
  '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';

export const mpbootSource: MPBootSource = {
  gitProvider: 'github',
  gitOwner: 'aqaurius6666',
  gitRepoName: 'mpboot',
};
