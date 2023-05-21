import { mkdir, stat } from 'fs/promises';

export const mkdirp = async (path: string) => {
  try {
    const statInfo = await stat(path);
    if (!statInfo.isDirectory()) {
      throw new Error(`${path} is not a directory`);
    }
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await mkdir(path, { recursive: true });
    }
  }
};
