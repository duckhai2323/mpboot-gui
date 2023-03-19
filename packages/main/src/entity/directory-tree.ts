import type { AsyncSubscription } from '@parcel/watcher';
import { subscribe } from '@parcel/watcher';
import { readFile, stat } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';
import { promisify } from 'util';
import type { Directory, DirectoryTreeEvent } from '../../../common/directory-tree';
import { logger } from '../../../common/logger';

const globAsync = promisify(glob);

export class DirectoryTree {
  private dirPath: string;
  private watcher: AsyncSubscription | null = null;
  private currentDirectory: Directory | null = null;

  constructor(dirPath: string) {
    this.dirPath = dirPath;
  }

  public async search(pattern: string): Promise<string[]> {
    const ret = await globAsync(pattern, { cwd: this.dirPath });
    return ret;
  }

  public async subscribe(onDirectoryTreeEvent: (events: DirectoryTreeEvent[]) => void) {
    this.watcher = await subscribe(this.dirPath, async (err, events) => {
      if (err) {
        logger.error('Error when subscribe watcher', err);
        return [];
      }
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

  public async explore(dirToExplore?: string): Promise<Directory> {
    const currentPath = dirToExplore || '';
    const pattern = path.join(currentPath, '*');
    const all = await globAsync(pattern, { cwd: this.dirPath });
    const files = await globAsync(pattern, { cwd: this.dirPath, nodir: true });
    const children: Directory[] = [];
    for (const file of files) {
      const tmpId = all.indexOf(file);
      all.splice(tmpId, 1);
    }
    all.forEach(file => {
      children.push({
        path: path.join(this.dirPath, file),
        name: path.basename(file),
        children: [],
      });
    });

    files.forEach(file => {
      children.push({
        path: path.join(this.dirPath, file),
        name: path.basename(file),
      });
    });
    if (dirToExplore === undefined) {
      this.currentDirectory = {
        path: this.dirPath,
        name: path.basename(this.dirPath),
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

    if (current.path === path.join(this.dirPath, nodePath)) {
      callback(current);
      return;
    }
    if (current.children === undefined) return;

    for (const child of current.children) {
      this.findNodeAndDo(child, nodePath, callback);
    }
  }
}
