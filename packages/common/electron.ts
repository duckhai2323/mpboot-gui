import type {
  CommandCallbackOnFinishResult,
  ExecuteCommandRequest,
  ExecuteCommandResponse,
  LoadExecutionHistoryRequest,
  LoadExecutionHistoryResponse,
  SaveExecutionHistoryRequest,
} from './commander';
import type { ContentFile } from './content-file';
import type { Directory } from './directory-tree';
import type { ShowContextMenuRequest } from './menu';
import type {
  CreateWorkspaceRequest,
  IWorkspace,
  DialogChooseDirectoryOrFileResult,
} from './workspace';

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
  unsubscribeLog: (logFile: string) => void;

  subscribeDirectoryTree: (dirPath: string) => CustomEventEmitter;
  getFirstLoadDirectoryTree: (dirPath: string) => Promise<Directory>;
  exploreDirectory: (dirPath: string, dirToExplore: string) => Promise<Directory>;
  searchDirectoryTree: (dirPath: string, pattern: string) => Promise<string[]>;

  openContentFile: (filePath: string) => Promise<ContentFile>;
  readContentFile: (filePath: string) => Promise<string>;

  executeCommand: (req: ExecuteCommandRequest) => Promise<ExecuteCommandResponse>;
  saveCommandExecution: (executionInfo: SaveExecutionHistoryRequest) => Promise<boolean>;
  loadExecutionHistory: (req: LoadExecutionHistoryRequest) => Promise<LoadExecutionHistoryResponse>;

  subscribeCommandCallbackOnFinish: (
    commandId: string,
    callback: (result: CommandCallbackOnFinishResult) => void,
  ) => Unsubscribe;

  chooseDirectory: () => Promise<DialogChooseDirectoryOrFileResult>;
  chooseDirectoryOrFile: () => Promise<DialogChooseDirectoryOrFileResult>;
  listWorkspaces: () => Promise<IWorkspace[]>;
  createWorkspace: (req: CreateWorkspaceRequest) => Promise<IWorkspace>;

  testAvailable: () => Promise<boolean>;

  dirname: (path: string) => string;
  basename: (path: string) => string;
  isDirectory: (path: string) => Promise<boolean>;
  join: (...paths: string[]) => string;

  showContentMenu: (req: ShowContextMenuRequest) => void;
}

export const unimplementedExposedElectron = {} as ExposedElectron;
