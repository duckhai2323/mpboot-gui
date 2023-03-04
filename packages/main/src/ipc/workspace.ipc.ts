import { dialog, ipcMain } from 'electron';
import { IPC_EVENTS } from '../../../common/ipc';
import { logger } from '../../../common/logger';
import type { IWorkspace, WorkspaceChooseDirectoryDialogResult } from '../../../common/workspace';
import { Workspace } from '../entity/workspace';
import { repository } from '../repository/repository';

ipcMain.handle(IPC_EVENTS.WORKSPACE_CHOOSE_DIRECTORY_DIALOG, async (_event): Promise<WorkspaceChooseDirectoryDialogResult> => {
    logger.debug('Received WORKSPACE_CHOOSE_DIRECTORY_DIALOG');
    const results = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    });
    logger.debug('dialog.showOpenDialog()', { results });
    return {
        canceled: results.canceled,
        directoryPath: results.filePaths.length > 0 ? results.filePaths[0] : undefined,
    };
});

ipcMain.handle(IPC_EVENTS.WORKSPACE_LIST, async (_event): Promise<IWorkspace[]> => {
    logger.debug('Received WORKSPACE_LIST');
    return await repository.listWorkspaces();
});


ipcMain.handle(IPC_EVENTS.WORKSPACE_CREATE, async (_event, dirPath: string): Promise<IWorkspace> => {
    logger.debug('Received WORKSPACE_CREATE', { dirPath });
    return await repository.createWorkspace(new Workspace(dirPath));
});