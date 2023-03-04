import md5 from 'md5';


export const IPC_EVENTS = {
  LOG_SUBSCRIBE: 'log:subscribe',
  LOG_FILE_OF: (logFile: string) => `log:file-${md5(logFile)}`,
  LOG_GENERATE: 'log:generate',

  DIRECTORY_TREE_SUBSCRIBE: 'directory-tree:subscribe',
  DIRECTORY_TREE_CHANGE_OF: (dirPath: string) => `directory-tree:change-${md5(dirPath)}`,
  DIRECTORY_TREE_FIRST_LOAD: 'directory-tree:first-load',
  DIRECTORY_TREE_UNSUBSCRIBE: 'directory-tree:unsubscribe',
  DIRECTORY_TREE_EXPLORE_DIRECTORY: 'directory-tree:explore-directory',

  CONTENT_FILE_OPEN: 'content-file:open',
  CONTENT_FILE_READ: 'content-file:read',

  COMMAND_EXECUTE: 'command:execute',
  COMMAND_CALLBACK_ON_FINISH: (commandId: string) => `command:${commandId}:callback-on-finish`,
};
