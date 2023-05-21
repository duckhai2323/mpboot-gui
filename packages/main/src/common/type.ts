export interface MPBootSource {
  gitProvider: string;
  gitOwner: string;
  gitRepoName: string;
}

export interface MPBootVersion {
  versionId: string;
  versionName: string;
  binaryPath?: string;
}
