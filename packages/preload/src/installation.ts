import { ipcRenderer } from 'electron';
import { IPC_EVENTS } from '../../common/ipc';
import type {
  InstallationGetMetadataResponse,
  OnDownloadCompleted,
  OnDownloadError,
  OnDownloadProgress,
  OnDownloadProgressEvent,
} from '../../common/installation';
import type { MPBootInstallation } from '../../main/src/configuration';

export const subscribeOnInstallationWillOpen: (
  onInstallationWillOpen: () => void,
) => () => void = onInstallationWillOpen => {
  ipcRenderer.on(IPC_EVENTS.INSTALLATION_OPEN, onInstallationWillOpen);

  return () => {
    ipcRenderer.off(IPC_EVENTS.INSTALLATION_OPEN, onInstallationWillOpen);
  };
};

export const getInstallationMetadata: () => Promise<InstallationGetMetadataResponse> = async () => {
  return (await ipcRenderer.invoke(
    IPC_EVENTS.INSTALLATION_GET_METADATA,
  )) as InstallationGetMetadataResponse;
};

export const installVersion: (
  version: {
    versionId: string;
    versionName: string;
  },
  onDownloadProgress: OnDownloadProgress,
  onDownloadCompleted: OnDownloadCompleted,
  onDownloadError: OnDownloadError,
) => () => void = (version, onDownloadProgress, onDownloadSucceed, onDownloadError) => {
  ipcRenderer.send(IPC_EVENTS.INSTALLATION_INSTALL_VERSION, version);
  const onDownloadProgressHandler = (_event: any, event: OnDownloadProgressEvent) => {
    onDownloadProgress(event);
  };
  ipcRenderer.on(
    IPC_EVENTS.INSTALLATION_CALLBACK_ON_PROGRESS(version.versionId),
    onDownloadProgressHandler,
  );
  const onDownloadCompletedHandler = (_event: any, binaryPath: string) => {
    onDownloadSucceed(binaryPath);
  };
  ipcRenderer.on(
    IPC_EVENTS.INSTALLATION_CALLBACK_ON_SUCCEED(version.versionId),
    onDownloadCompletedHandler,
  );
  const onDownloadErrorHandler = (_event: any, errMsg: string) => {
    onDownloadError(errMsg);
  };
  ipcRenderer.on(
    IPC_EVENTS.INSTALLATION_CALLBACK_ON_ERROR(version.versionId),
    onDownloadErrorHandler,
  );
  return () => {
    ipcRenderer.off(
      IPC_EVENTS.INSTALLATION_CALLBACK_ON_PROGRESS(version.versionId),
      onDownloadProgressHandler,
    );
    ipcRenderer.off(
      IPC_EVENTS.INSTALLATION_CALLBACK_ON_SUCCEED(version.versionId),
      onDownloadCompletedHandler,
    );
    ipcRenderer.off(
      IPC_EVENTS.INSTALLATION_CALLBACK_ON_ERROR(version.versionId),
      onDownloadErrorHandler,
    );
  };
};

export const useVersion = (
  versionName: string,
  binaryPath: string,
  installationType: MPBootInstallation,
) => {
  ipcRenderer.send(IPC_EVENTS.INSTALLATION_USE_VERSION, {
    versionName,
    binaryPath,
    installationType,
  });
};
