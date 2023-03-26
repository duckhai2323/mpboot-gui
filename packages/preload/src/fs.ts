import path from 'path';
import { stat } from 'fs/promises';
export const dirname = path.dirname;
export const basename = path.basename;
export const join = path.join;

export const isDirectory = async (_path: string): Promise<boolean> => {
  return await stat(_path).then(stat => {
    return stat.isDirectory();
  });
};
