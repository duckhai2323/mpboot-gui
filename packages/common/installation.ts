import type { MPBootInstallation } from '../main/src/configuration';

export interface InstallationGetMetadataResponse {
  name: string;
  description: string;
  sourceUrl: string;
  currentVersion: string;
  installationType: MPBootInstallation;
  versions: {
    versionId: string;
    versionName: string;
    binaryPath?: string;
  }[];
}

export interface InstallationInstallVersionRequest {
  versionId: string;
  versionName: string;
}

export interface InstallationUseVersionRequest {
  installationType: MPBootInstallation;
  versionName: string;
  binaryPath: string;
}

export interface OnDownloadProgressEvent {
  progress: number;
  loadedSize: number;
  totalSize: number;
}

export type OnDownloadProgress = (event: OnDownloadProgressEvent) => void;
export type OnDownloadError = (errorMsg: string) => void;
export type OnDownloadCompleted = (binaryPath: string) => void;
