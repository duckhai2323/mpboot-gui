export interface CommandExecuteResult {
  commandId: string;
  logFile: string;
}

export interface CommandCallbackOnFinishResult {
  treeFile: string;
  isError: boolean;
}
