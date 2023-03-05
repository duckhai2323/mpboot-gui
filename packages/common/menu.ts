export interface ShowContextMenuRequest {
  x: number;
  y: number;
  type: ContextMenuType;
  data?: any;
}

export type ContextMenuType = 'file-tree-item-file' | 'file-tree-item-directory';
