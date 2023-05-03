import type { AsyncSubscription } from '@parcel/watcher';
import { subscribe } from '@parcel/watcher';
import { access, constants, readFile, stat, symlink } from 'fs/promises';
import { glob } from 'glob';
import path, { join } from 'path';
import { promisify } from 'util';
import type { Directory, DirectoryTreeEvent } from '../../../common/directory-tree';
import { logger } from '../../../common/logger';
import type { WorkspaceInputData } from './workspace-input-data';

const globAsync = promisify(glob);

export class DirectoryTree {
  private path: string;
  private name: string;
  private watcher: AsyncSubscription | null = null;
  private currentDirectory: Directory | null = null;
  private inputData: WorkspaceInputData[];

  constructor(name: string, path: string, inputData: WorkspaceInputData[]) {
    this.path = path;
    this.name = name;
    this.inputData = inputData;
  }

  public async search(pattern: string): Promise<string[]> {
    const ret = await globAsync(pattern, { cwd: this.path });
    return ret;
  }

  public async subscribe(onDirectoryTreeEvent: (events: DirectoryTreeEvent[]) => void) {
    this.watcher = await subscribe(this.path, async (err, events) => {
      if (err) {
        logger.error('Error when subscribe watcher', err);
        return [];
      }
      logger.debug('changed ', events);
      const directoryTreeEvents: DirectoryTreeEvent[] = await Promise.all(
        events.map(async event => {
          let data = '';
          let isDirectory = false;
          if (event.type === 'create' || event.type === 'update') {
            try {
              const statInfo = await stat(event.path);
              if (statInfo.isDirectory()) {
                isDirectory = true;
              } else {
                data = await readFile(event.path, 'utf-8');
              }
            } catch (err: any) {
              logger.error(err?.message, err);
            }
          }
          return {
            path: event.path,
            type: event.type,
            data: data,
            isDirectory: isDirectory,
          };
        }),
      );
      onDirectoryTreeEvent(directoryTreeEvents);
    });
  }

  public async unsubscribe() {
    if (this.watcher) {
      await this.watcher.unsubscribe();
    }
  }

  public async bootstrap() {
    try {
      if (!(await stat(this.path)).isDirectory()) {
        throw new Error('Workspace directory tree invalid is not directory');
      }
      const wsPath = this.path;
      this.currentDirectory = {
        path: wsPath,
        name: this.name,
        children: await Promise.all(this.inputData.map(e => this.bootstrapDirectory(wsPath, e))),
      };
    } catch (err: any) {
      logger.error(err?.message, err);
      throw new Error('Workspace directory tree invalid');
    }
  }
  private async isExist(path: string): Promise<boolean> {
    try {
      await access(path, constants.F_OK);
      return true;
    } catch (err: any) {
      return false;
    }
  }
  private async bootstrapDirectory(
    wsPath: string,
    inputData: WorkspaceInputData,
  ): Promise<Directory> {
    const inputStat = await stat(inputData.inputPath);
    const type = inputStat.isDirectory() ? 'dir' : 'file';

    if (!(await this.isExist(join(wsPath, inputData.refName)))) {
      await symlink(inputData.inputPath, join(wsPath, inputData.refName), type);
    }
    return {
      path: join(wsPath, inputData.refName),
      name: inputData.refName,
    };
  }

  public async loadDirectoryTree(): Promise<Directory> {
    const pattern = path.join(this.path, '**/**');
    const all = await globAsync(pattern, { cwd: this.path });
    const files = await globAsync(pattern, { cwd: this.path, nodir: true });
    for (const file of files) {
      const tmpId = all.indexOf(file);
      all.splice(tmpId, 1);
    }
    const directory: Directory = {
      name: this.name,
      path: this.path,
      children: [],
    };
    all.splice(0, 1);

    const findDirectoryAndAddNode = (dir: Directory, dirPath: string, node: Directory) => {
      if (dir.path === dirPath) {
        if (!dir.children) {
          dir.children = [node];
        } else {
          dir.children.push(node);
        }
        return true;
      }
      if (dir.children !== undefined) {
        for (const child of dir.children) {
          if (findDirectoryAndAddNode(child, dirPath, node)) {
            return true;
          }
        }
      }
      return false;
    };
    all.forEach(child => {
      const dirPath = path.dirname(child);
      logger.debug(dirPath);
      findDirectoryAndAddNode(directory, dirPath, {
        name: path.basename(child),
        path: child,
        children: [],
      });
    });
    files.forEach(file => {
      const dirPath = path.dirname(file);
      findDirectoryAndAddNode(directory, dirPath, {
        name: path.basename(file),
        path: file,
        children: undefined,
      });
    });
    this.currentDirectory = directory;
    return directory;
  }
  public async explore(dirToExplore?: string): Promise<Directory> {
    const currentPath = dirToExplore || '';
    const pattern = path.join(currentPath, '*');
    const all = await globAsync(pattern, { cwd: this.path });
    const files = await globAsync(pattern, { cwd: this.path, nodir: true });
    logger.debug('Explore', { pattern, all, files });
    const children: Directory[] = [];
    for (const file of files) {
      const tmpId = all.indexOf(file);
      all.splice(tmpId, 1);
    }
    all.forEach(async file => {
      children.push({
        path: path.join(this.path, file),
        name: path.basename(file),
        children: [],
      });
    });

    files.forEach(file => {
      children.push({
        path: path.join(this.path, file),
        name: path.basename(file),
      });
    });
    if (dirToExplore === undefined) {
      this.currentDirectory = {
        path: this.path,
        name: path.basename(this.path),
        children: children,
      };

      return this.currentDirectory;
    }
    let targetDir: Directory = this.currentDirectory!;
    this.findNodeAndDo(this.currentDirectory!, dirToExplore, dir => {
      dir.children = children;
      targetDir = dir;
    });
    return targetDir;
  }

  private findNodeAndDo(current: Directory, nodePath: string, callback: (node: Directory) => void) {
    if (!current) return;

    if (current.path === path.join(this.path, nodePath)) {
      callback(current);
      return;
    }
    if (current.children === undefined) return;

    for (const child of current.children) {
      this.findNodeAndDo(child, nodePath, callback);
    }
  }
}
