import type { NodeData } from '@aqaurius6666/react-folder-tree';
import type { Directory, DirectoryTreeEvent } from '../../../../common/directory-tree';

const executionHistoryRegexp = new RegExp('execution_[0-9]+_[0-9]+');

export const convertDirectoryToNodeData = (directory: Directory): NodeData => {
  let executionHistory = undefined;
  const executionHisotryResult = executionHistoryRegexp.exec(directory.path);
  if (executionHisotryResult) {
    executionHistory = executionHisotryResult[executionHisotryResult.length - 1];
  }
  if (directory.children === undefined) {
    return {
      id: directory.path,
      name: directory.name,
      type: 'file',
      isOpen: false,
      checked: 0,
      executionHistory,
    };
  }
  return {
    id: directory.path,
    name: directory.name,
    children: directory.children.map(convertDirectoryToNodeData),
    type: 'directory',
    explored: true,
    isOpen: false,
    checked: 0,
    executionHistory,
  };
};

export const convertDirectoryTreeEventToNodeData = (
  event: DirectoryTreeEvent,
  name: string,
): NodeData => {
  let executionHistory = undefined;
  const executionHisotryResult = executionHistoryRegexp.exec(event.path);
  if (executionHisotryResult) {
    executionHistory = executionHisotryResult[executionHisotryResult.length - 1];
  }

  const nodeData = {
    id: event.path,
    name: name,
    isOpen: false,
    executionHistory,
    ...(event.isDirectory
      ? {
          children: [],
          type: 'directory',
          explored: false,
        }
      : {
          type: 'file',
        }),
  };

  return nodeData;
};

export const findNodeDataAndUpdate = (
  node: NodeData,
  path: string,
  callback: (node: NodeData) => void,
) => {
  if (!node) return;

  if (node.id === path) {
    callback(node);
  }
  if (!path.includes(node.id)) return;

  node.children?.forEach(child => {
    findNodeDataAndUpdate(child, path, callback);
  });
};
