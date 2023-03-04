export interface DirectoryTreeEvent {
  path: string;
  type: 'create' | 'update' | 'delete';
  data: string;
  isDirectory: boolean;
}

export interface Directory {
  path: string;
  name: string;
  children?: Directory[];
}
