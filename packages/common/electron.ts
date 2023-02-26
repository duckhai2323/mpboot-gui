import type { CommandCallbackOnFinishResult, CommandExecuteResult } from './commander';
import type { ContentFile } from './content-file';
import type { Directory } from './directory-tree';
import type { Parameter } from './parameter';

export interface CustomEventEmitter {
  on: (event: string, callback: (data: any) => void) => void;
  unregister: () => void;
}

export interface Unsubscribe {
  unsubscribe: () => void;
}

export interface ExposedElectron {
  subscribeLog: (logFile: string) => CustomEventEmitter;
  generateLog: () => Promise<string>;

  subscribeDirectoryTree: (dirPath : string) => CustomEventEmitter;
  getFirstLoadDirectoryTree: (dirPath : string) => Promise<Directory>;
  exploreDirectory: (dirPath : string, dirToExplore : string) => Promise<Directory>;

  openContentFile: (filePath: string) => Promise<ContentFile>;
  readContentFile: (filePath: string) => Promise<string>;

  executeCommand: (parameter: Parameter) => Promise<CommandExecuteResult>;

  subscribeCommandCallbackOnFinish: (commandId: string, callback: (result: CommandCallbackOnFinishResult) => void) => Unsubscribe;

  testAvailable: () => boolean
}

export const unimplementedExposedElectron = {} as ExposedElectron;
