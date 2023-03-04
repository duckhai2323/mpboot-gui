import type { AsyncSubscription, Event} from '@parcel/watcher';
import { subscribe } from '@parcel/watcher';
import { readFile } from 'fs/promises';
import { glob } from 'glob';
import { promisify } from 'util';
import type { Directory, DirectoryTreeEvent } from '../../../common/directory-tree';

const globAsync = promisify(glob);

export class DirectoryTree {
    private dirPath: string;
    private watcher: AsyncSubscription | null = null;
    private currentDirectory: Directory | null = null;
    private onDirectoryTreeEvent: (events: DirectoryTreeEvent[]) => void = (_events) => {return; };

    constructor(dirPath: string) {
        this.dirPath = dirPath;
    }

    public async subscribe(onDirectoryTreeEvent: (events: DirectoryTreeEvent[]) => void) {
        this.onDirectoryTreeEvent = onDirectoryTreeEvent;
        this.watcher = await subscribe(this.dirPath, this.onEvent);
    }

    private async onEvent(err: Error | null, events: Event[]) {
        if (err) {
            console.log(err);
        }
        const directoryTreeEvents: DirectoryTreeEvent[] = await Promise.all(events.map(async (event) => {
            let data = '';
            if (event.type === 'create' || event.type === 'update') {
                data = await readFile(event.path, 'utf-8');
            }
            return {
                path: event.path,
                type: event.type,
                data: data,
            };
        }));

        this.onDirectoryTreeEvent(directoryTreeEvents);
    }

    public async unsubscribe() {
        if (this.watcher) {
            await this.watcher.unsubscribe();
        }
    }

    public async explore(dirToExplore?: string): Promise<Directory> {
        const currentPath = dirToExplore ? `${dirToExplore}/` : '';
        const pattern = currentPath + '*';
        const all = await globAsync(pattern, { cwd: this.dirPath });
        const files = await globAsync(pattern, { cwd: this.dirPath, nodir: true });
        const children: Directory[] = [];
        for (const file of files) {
            const tmpId = all.indexOf(file);
            all.splice(tmpId, 1);
        }
        all.forEach((file) => {
            children.push({
                path: `${this.dirPath}/${file}`,
                name: file.split('/').pop()!,
                children: [],
            });
        });

        files.forEach((file) => {
            children.push({
                path: `${this.dirPath}/${file}`,
                name: file.split('/').pop()!,
            });
        });
        if (dirToExplore === undefined) {
            this.currentDirectory = {
                path: this.dirPath,
                name: this.dirPath.split('/').pop()!,
                children: children,
            };

            return this.currentDirectory;
        }
        let targetDir: Directory = this.currentDirectory!;
        this.findDirAndUpdate(this.currentDirectory!, dirToExplore, (dir) => {
            dir.children = children;
            targetDir = dir;
        });
        return targetDir;
    }

    private findDirAndUpdate(current: Directory, dirPath: string, callback: (dir: Directory) => void) {
        if (!current) return;
        if (current.children === undefined) return;

        if (current.path === this.dirPath + '/' + dirPath) {
            callback(current);
            return;
        }
        for (const child of current.children) {
            this.findDirAndUpdate(child, dirPath, callback);
        }
    }

}


