import type { NodeData } from '@aqaurius6666/react-folder-tree';
import type { Directory } from '../../../../common/directory-tree';

export const convertDirectoryToNodeData = (directory: Directory): NodeData => {
  if (directory.children === undefined) {
    return {
      id: directory.path,
      name: directory.name,
      type: 'file',
      isOpen: false,
      checked: 0,
    };
  }
  return {
    id: directory.path,
    name: directory.name,
    children: directory.children.map(convertDirectoryToNodeData),
    type: 'directory',
    explored: false,
    isOpen: false,
    checked: 0,
  };
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
