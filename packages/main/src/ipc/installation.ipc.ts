import { tmpdir } from 'os';
import type {
  InstallationGetMetadataResponse,
  InstallationInstallVersionRequest,
  InstallationUseVersionRequest,
} from '../../../common/installation';
import { IPC_EVENTS } from '../../../common/ipc';
import type { OSType } from '../../../common/stuff';
import type { MPBootSource } from '../common/type';
import { globalConfig, saveConfiguration } from '../configuration';
import { is, mpbootSource } from '../const';
import { Installation } from '../entity/installation';
import { MPBootCommander } from '../entity/mpboot-commander';
import { wrapperIpcMainHandle, wrapperIpcMainOn } from './common.ipc';
import { join } from 'path';
import { logger } from '../../../common/logger';
import { binaryPath, binaryPathFor } from '../electron-const';

const buildSource = (source: MPBootSource): string => {
  switch (source.gitProvider) {
    case 'github':
      return `https://github.com/${source.gitOwner}/${source.gitRepoName}`;
    default:
      return 'https://example.com';
  }
};

wrapperIpcMainHandle(
  IPC_EVENTS.INSTALLATION_GET_METADATA,
  async (_event): Promise<InstallationGetMetadataResponse> => {
    const currentVersion = await MPBootCommander.getVersion(globalConfig.mpboot.currentPath);

    const versions = await Installation.listVersions(mpbootSource, binaryPath);
    return {
      name: 'MPBoot',
      description: 'MPBoot is a tool for bootstrapping a new project with a pre-defined structure',
      sourceUrl: buildSource(mpbootSource),
      currentVersion: currentVersion,
      installationType: globalConfig.mpboot.installation,
      versions,
    };
  },
);

wrapperIpcMainOn(
  IPC_EVENTS.INSTALLATION_INSTALL_VERSION,
  async (event, req: InstallationInstallVersionRequest) => {
    try {
      const osType: OSType = is.linux ? 'ubuntu' : is.win ? 'windows' : 'macos';
      const url = await Installation.getAssetUrl(mpbootSource, req, osType);
      const dest = join(tmpdir(), `mpbootgui-installation-${new Date().getTime()}`);
      await Installation.downloadAsset(url, dest, progressEvent => {
        // logger.debug(`Installation progress: ${progressEvent.progress}`)
        event.sender.send(
          IPC_EVENTS.INSTALLATION_CALLBACK_ON_PROGRESS(req.versionId),
          progressEvent,
        );
      });
      logger.debug(dest);
      const binaryPath = await Installation.extractAsset(dest, binaryPathFor(req.versionName));
      event.sender.send(IPC_EVENTS.INSTALLATION_CALLBACK_ON_SUCCEED(req.versionId), binaryPath);
    } catch (error: any) {
      logger.error('Error when install version', error);
      event.sender.send(IPC_EVENTS.INSTALLATION_CALLBACK_ON_ERROR(req.versionId), error?.message);
    }
  },
);

wrapperIpcMainOn(
  IPC_EVENTS.INSTALLATION_USE_VERSION,
  async (_event, req: InstallationUseVersionRequest) => {
    try {
      const { versionName, binaryPath, installationType } = req;
      if (installationType === 'pre-installed') {
        await saveConfiguration({
          ...globalConfig,
          mpboot: {
            ...globalConfig.mpboot,
            installation: 'pre-installed',
            currentPath: 'mpboot',
          },
        });
      } else {
        await saveConfiguration({
          ...globalConfig,
          mpboot: {
            ...globalConfig.mpboot,
            installation: 'in-app',
            currentPath: binaryPath,
            currentVersion: versionName,
          },
        });
      }
    } catch (error: any) {
      logger.error('Error when use version', error);
    }
  },
);
