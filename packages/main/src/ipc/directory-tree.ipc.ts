import { ipcMain } from "electron";
import { IPC_EVENTS } from "../../../common/ipc";
import { logger } from "../../../common/logger";
import { DirectoryTree } from "../entity/directory-tree";
import { createInstanceKey, instanceManager } from "../entity/instance-manager";

ipcMain.on(IPC_EVENTS.DIRECTORY_TREE_SUBSCRIBE, async (event, dirPath) => {
    logger.log("Received SUBSCRIBE_TREE_CHANNEL", dirPath);
    const instanceKey = createInstanceKey("directory-tree", dirPath);
    let tree : DirectoryTree;
    if (instanceManager.has(instanceKey)) {
        logger.log("Already have a tree instance", instanceKey)
        tree = instanceManager.get(instanceKey) as DirectoryTree;
    } else {
        tree = new DirectoryTree(dirPath)
        instanceManager.set(instanceKey, tree);
        logger.log("Create a new tree instance", instanceKey)
    }

    tree.subscribe((events) => {
        event.sender.send(IPC_EVENTS.DIRECTORY_TREE_CHANGE_OF(dirPath), events);
    })
});

ipcMain.on(IPC_EVENTS.DIRECTORY_TREE_UNSUBSCRIBE, async (event, dirPath) => {
    logger.log("Received UNSUBSCRIBE_TREE_CHANNEL", dirPath);
    const instanceKey = createInstanceKey("directory-tree", dirPath);
    const tree = instanceManager.get(instanceKey) as DirectoryTree;
    if (tree) {
        await tree.unsubscribe();
        instanceManager.delete(instanceKey);
        logger.log("Delete a tree instance", instanceKey)
    }
})

ipcMain.handle(IPC_EVENTS.DIRECTORY_TREE_FIRST_LOAD, async (event, dirPath) => {
    logger.log("Received FIRST_LOAD_TREE_CHANNEL", dirPath);
    const instanceKey = createInstanceKey("directory-tree", dirPath);
    let tree : DirectoryTree;
    if (instanceManager.has(instanceKey)) {
        logger.log("Already have a tree instance", instanceKey)
        tree = instanceManager.get(instanceKey) as DirectoryTree;
    } else {
        tree = new DirectoryTree(dirPath)
        instanceManager.set(instanceKey, tree);
        logger.log("Create a new tree instance", instanceKey)
    }
    const result = await tree.explore();
    return result;
})


ipcMain.handle(IPC_EVENTS.DIRECTORY_TREE_EXPLORE_DIRECTORY, async (event, {dirPath, dirToExplore}) => {
    logger.log("Received EXPLORE_DIRECTORY_CHANNEL", {dirPath, dirToExplore});
    const instanceKey = createInstanceKey("directory-tree", dirPath);
    let tree : DirectoryTree;
    if (instanceManager.has(instanceKey)) {
        logger.log("Already have a tree instance", instanceKey)
        tree = instanceManager.get(instanceKey) as DirectoryTree;
    } else {
        tree = new DirectoryTree(dirPath)
        instanceManager.set(instanceKey, tree);
        logger.log("Create a new tree instance", instanceKey)
    }
    const result = await tree.explore(dirToExplore);
    return result;
})
