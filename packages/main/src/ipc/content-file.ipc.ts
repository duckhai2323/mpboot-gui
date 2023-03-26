import { IPC_EVENTS } from '../../../common/ipc';
import { logger } from '../../../common/logger';
import { ContentFile } from '../entity/content-file';
import { createInstanceKey, instanceManager } from '../entity/instance-manager';
import { wrapperIpcMainHandle } from './common.ipc';

wrapperIpcMainHandle(
  IPC_EVENTS.CONTENT_FILE_OPEN,
  async (event, filePath): Promise<ContentFile> => {
    // const instanceKey = createInstanceKey('content-file', filePath);
    // if (instanceManager.has(instanceKey)) {
    //   logger.debug('Already have a content-file instance', instanceKey);
    //   contentFile = instanceManager.get(instanceKey) as ContentFile;
    // } else {
    const contentFile = new ContentFile(filePath);
    //   instanceManager.set(instanceKey, contentFile);
    //   logger.debug('Create a new content-file instance', instanceKey);
    // }
    return contentFile;
  },
);

wrapperIpcMainHandle(IPC_EVENTS.CONTENT_FILE_READ, async (event, filePath): Promise<string> => {
  const instanceKey = createInstanceKey('content-file', filePath);
  let contentFile: ContentFile;
  if (!instanceManager.has(instanceKey)) {
    contentFile = new ContentFile(filePath);
    instanceManager.set(instanceKey, contentFile);
    logger.debug('Create a new content-file instance', instanceKey);
  } else {
    contentFile = instanceManager.get(instanceKey) as ContentFile;
  }
  try {
    return await contentFile.getFileContent();
  } catch (err: any) {
    logger.error('Failed to read file', err);
    return '';
  }
});
