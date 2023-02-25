import { ipcMain } from "electron";
import { IPC_EVENTS } from "../../../common/ipc";
import { logger } from "../../../common/logger";
import { ContentFile } from "../entity/content-file";
import { createInstanceKey, instanceManager } from "../entity/instance-manager";

ipcMain.handle(IPC_EVENTS.CONTENT_FILE_OPEN, async (event, filePath) : Promise<ContentFile> => {
    logger.log("Received CONTENT_FILE_OPEN", {filePath});
    const instanceKey = createInstanceKey("content-file", filePath);
    let contentFile : ContentFile;
    if (instanceManager.has(instanceKey)) {
        logger.log("Already have a content-file instance", instanceKey)
        contentFile = instanceManager.get(instanceKey) as ContentFile;
    } else {
        contentFile = new ContentFile(filePath)
        instanceManager.set(instanceKey, contentFile);
        logger.log("Create a new content-file instance", instanceKey)
    }
    return contentFile;
})

ipcMain.handle(IPC_EVENTS.CONTENT_FILE_READ, async (event, filePath) : Promise<string> => {
    console.log("Received CONTENT_FILE_READ", {filePath});
    const instanceKey = createInstanceKey("content-file", filePath);
    let contentFile : ContentFile;
    if (!instanceManager.has(instanceKey)) {
        contentFile = new ContentFile(filePath)
        instanceManager.set(instanceKey, contentFile);
        logger.log("Create a new content-file instance", instanceKey)
    } else {
        contentFile = instanceManager.get(instanceKey) as ContentFile;
    }
    return contentFile.getFileContent();
})