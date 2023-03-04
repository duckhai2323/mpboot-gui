import type { Commander } from './commander';
import type { ContentFile } from './content-file';
import type { DirectoryTree } from './directory-tree';
import type { LogManager } from './log-manager';

export type EntityKey = 'commander' | 'directory-tree' | 'log' | 'content-file';
export type Entity = Commander | DirectoryTree | LogManager | ContentFile;
export type InstanceKey = string;
export const createInstanceKey = (entity: EntityKey, key: string): InstanceKey => {
  return `${entity}:${key}`;
};
export const instanceManager = new Map<InstanceKey, Entity>();
