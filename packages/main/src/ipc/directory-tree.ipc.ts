import { IPC_EVENTS } from '../../../common/ipc';
import { logger } from '../../../common/logger';
import { DirectoryTree } from '../entity/directory-tree';
import { createInstanceKey, instanceManager } from '../entity/instance-manager';
import { repository } from '../repository/repository';
import { wrapperIpcMainHandle, wrapperIpcMainOn } from './common.ipc';

wrapperIpcMainOn(IPC_EVENTS.DIRECTORY_TREE_SUBSCRIBE, async (event, dirPath) => {
  const instanceKey = createInstanceKey('directory-tree', dirPath);
  let tree: DirectoryTree;
  if (instanceManager.has(instanceKey)) {
    logger.debug('Already have a tree instance', instanceKey);
    tree = instanceManager.get(instanceKey) as DirectoryTree;
  } else {
    const ws = await repository.getWorkspaceByDirectoryPath(dirPath);
    if (!ws) {
      throw new Error('Invalid dirPath');
    }
    tree = new DirectoryTree(ws.name, ws.path, ws.inputData!);
    await tree.bootstrap();
    instanceManager.set(instanceKey, tree);
    logger.debug('Create a new tree instance', instanceKey);
  }

  tree.subscribe(events => {
    // logger.debug("Send a tree change event", events)
    event.sender.send(IPC_EVENTS.DIRECTORY_TREE_CHANGE_OF(dirPath), events);
  });
});

wrapperIpcMainOn(IPC_EVENTS.DIRECTORY_TREE_UNSUBSCRIBE, async (event, dirPath) => {
  const instanceKey = createInstanceKey('directory-tree', dirPath);
  const tree = instanceManager.get(instanceKey) as DirectoryTree;
  if (tree) {
    await tree.unsubscribe();
  }
});

wrapperIpcMainHandle(IPC_EVENTS.DIRECTORY_TREE_FIRST_LOAD, async (event, dirPath) => {
  const instanceKey = createInstanceKey('directory-tree', dirPath);
  let tree: DirectoryTree;
  if (instanceManager.has(instanceKey)) {
    logger.debug('Already have a tree instance', instanceKey);
    tree = instanceManager.get(instanceKey) as DirectoryTree;
  } else {
    const ws = await repository.getWorkspaceByDirectoryPath(dirPath);
    if (!ws) {
      throw new Error('Invalid dirPath');
    }
    tree = new DirectoryTree(ws.name, ws.path, ws.inputData!);
    await tree.bootstrap();
    instanceManager.set(instanceKey, tree);
    logger.debug('Create a new tree instance', instanceKey);
  }
  const result = await tree.explore();
  return result;
});

wrapperIpcMainHandle(
  IPC_EVENTS.DIRECTORY_TREE_EXPLORE_DIRECTORY,
  async (_event, { dirPath, dirToExplore }) => {
    const instanceKey = createInstanceKey('directory-tree', dirPath);
    let tree: DirectoryTree;
    if (instanceManager.has(instanceKey)) {
      logger.debug('Already have a tree instance', instanceKey);
      tree = instanceManager.get(instanceKey) as DirectoryTree;
    } else {
      const ws = await repository.getWorkspaceByDirectoryPath(dirPath);
      if (!ws) {
        throw new Error('Invalid dirPath');
      }
      tree = new DirectoryTree(ws.name, ws.path, ws.inputData!);
      await tree.bootstrap();
      instanceManager.set(instanceKey, tree);
      logger.debug('Create a new tree instance', instanceKey);
    }
    const result = await tree.explore(dirToExplore);
    return result;
  },
);

wrapperIpcMainHandle(
  IPC_EVENTS.DIRECTORY_TREE_SEARCH,
  async (_event, { dirPath, pattern }: { dirPath: string; pattern: string }) => {
    const instanceKey = createInstanceKey('directory-tree', dirPath);
    let tree: DirectoryTree;
    if (instanceManager.has(instanceKey)) {
      logger.debug('Already have a tree instance', instanceKey);
      tree = instanceManager.get(instanceKey) as DirectoryTree;
    } else {
      const ws = await repository.getWorkspaceByDirectoryPath(dirPath);
      if (!ws) {
        throw new Error('Invalid dirPath');
      }
      tree = new DirectoryTree(ws.name, ws.path, ws.inputData!);
      await tree.bootstrap();
      instanceManager.set(instanceKey, tree);
      logger.debug('Create a new tree instance', instanceKey);
    }
    const result = await tree.search(pattern);
    return result;
  },
);
