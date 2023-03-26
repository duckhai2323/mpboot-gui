import type { MouseEventHandler } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { Directory, DirectoryTreeEvent } from '../../../common/directory-tree';
import { logger } from '../../../common/logger';
import {
  convertDirectoryToNodeData,
  findNodeDataAndUpdate,
} from '../components/FileTree/convert-directory-to-node-data';
import { useContentView } from './useContentView';
import { useElectron } from './useElectron';
import { useParameter } from './useParameter';
import { findTargetNode } from 'use-tree-state';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store/root';
import { getRelativePath } from '../utils/fs';
import type { NodeData } from '@aqaurius6666/react-folder-tree';
import { usePhylogenTree } from './usePhylogenTree';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const useFileTreeImpl = (): [
  nodeData: NodeData | undefined,
  onTreeStateChange: (state: any, event: any) => void,
  onNameClick: ({
    defaultOnClick,
    nodeData,
  }: {
    defaultOnClick: () => void;
    nodeData: NodeData;
  }) => void,
  onContextMenu: MouseEventHandler<HTMLElement>,
] => {
  const { dirPath } = useSelector((state: RootState) => state.workspace);
  const [openFile, notifyContentFileChange] = useContentView();
  const [setSource, multiSourcesDispatch] = useParameter();
  const [, , setTreeFile] = usePhylogenTree();
  const electron = useElectron();
  const [nodeData, setNodeData] = useState<NodeData>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!dirPath) {
      navigate('/dashboard');
      return;
    }
    (async () => {
      try {
        const directory = await electron.getFirstLoadDirectoryTree(dirPath);
        setNodeData(convertDirectoryToNodeData(directory));
      } catch (err: any) {
        toast.error(err.message);
      }
    })();
  }, [dirPath]);

  const reduceNodeData = useCallback((node: NodeData, events: DirectoryTreeEvent[]): NodeData => {
    const tmp = { ...node };
    let isChanged = false;
    for (const event of events) {
      const parentPath = electron.dirname(event.path);
      if (event.type === 'create') {
        findNodeDataAndUpdate(tmp, parentPath, found => {
          if (found.children?.findIndex(e => e.id == event.path) !== -1) {
            logger.warn('already exists create directory tree', event.path);
            return;
          }
          const children = found.children || [];
          const nodeToPush = {
            id: event.path,
            name: electron.basename(event.path),
            isOpen: false,
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
          children.push(nodeToPush);
          children.sort((a, b) => {
            if (a.type === 'directory' && b.type === 'file') {
              return -1;
            }
            if (a.type === 'file' && b.type === 'directory') {
              return 1;
            }
            return a.name.localeCompare(b.name);
          });
          found.children = children;
          isChanged = true;
        });
      } else if (event.type === 'update') {
        findNodeDataAndUpdate(tmp, event.path, found => {
          if (found.type === 'file') {
            notifyContentFileChange(event.path, event.data);
          } else {
            logger.warn('skip update directory directory tree', event.path);
          }
        });
      } else if (event.type === 'delete') {
        findNodeDataAndUpdate(tmp, parentPath, found => {
          const _children = found.children?.filter(child => child.id !== event.path);
          if (_children?.length === found.children?.length) {
            logger.warn('not found for delete directory tree', event.path);
            return;
          }
          found.children = _children;
          isChanged = true;
        });
      }
    }
    if (isChanged) {
      return tmp;
    }
    return node;
  }, []);

  useEffect(() => {
    if (!dirPath) return;
    try {
      const emitter = electron.subscribeDirectoryTree(dirPath);
      emitter.on('data', (events: DirectoryTreeEvent[]) => {
        setNodeData(nodeData => reduceNodeData(nodeData!, events));
      });
      return () => {
        emitter.unregister();
      };
    } catch (err: any) {
      toast.error(err.message);
    }
  }, [dirPath, reduceNodeData]);

  const onTreeStateChange = useCallback((state: NodeData, event: any) => {
    try {
      if (event.type === 'toggleOpen') {
        const clickedNodeData = findTargetNode(state, event.path);
        if (clickedNodeData.explored) return;
        electron
          .exploreDirectory(dirPath, getRelativePath(clickedNodeData.id, dirPath))
          .then(async (data: Directory) => {
            const node = convertDirectoryToNodeData(data);
            const _tmp = { ...state };
            findNodeDataAndUpdate(_tmp, node.id, found => {
              found.children = node.children;
              found.explored = true;
              found.isOpen = true;
            });
            setNodeData(_node => _tmp);
          });
      }
      if (event.type === 'checkNode') {
        const clickedNodeData = findTargetNode(state, event.path);
        handleCheckNode(clickedNodeData, event.params[0]);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  }, []);

  const handleCheckNode = useCallback((node: NodeData, checked: 0 | 1) => {
    if (node.type === 'file') {
      if (checked) {
        multiSourcesDispatch({ type: 'add', payload: node.id });
      } else {
        multiSourcesDispatch({ type: 'remove', payload: node.id });
      }
    } else {
      node.children?.forEach((child: NodeData) => {
        handleCheckNode(child, checked);
      });
    }
  }, []);

  const onNameClick = useCallback(
    ({
      defaultOnClick,
      nodeData: clickedNodeData,
    }: {
      defaultOnClick: () => void;
      nodeData: NodeData;
    }) => {
      if (!nodeData) return;
      try {
        if (clickedNodeData.type === 'file') {
          openFile(clickedNodeData.id);
          setSource(clickedNodeData.id);
          setTreeFile(clickedNodeData.id);
        }
        if (clickedNodeData.type === 'directory') {
          if (clickedNodeData.explored) {
            return;
          } else {
            electron
              .exploreDirectory(dirPath, getRelativePath(clickedNodeData.id, dirPath))
              .then(async (data: Directory) => {
                const node = convertDirectoryToNodeData(data);
                const _tmp = { ...nodeData };
                findNodeDataAndUpdate(_tmp, node.id, found => {
                  found.children = node.children;
                  found.explored = true;
                  found.isOpen = true;
                });
                setNodeData(_node => _tmp);
              });
          }
        }
      } catch (err: any) {
        toast.error(err.message);
      }

      defaultOnClick();
    },
    [JSON.stringify(nodeData), dirPath],
  );

  const onContextMenu: MouseEventHandler<HTMLElement> = useCallback(
    e => {
      e.preventDefault();
      const { clientX, clientY } = e;
      const targetElement = e.target as HTMLElement;
      const { folderTreePath } = targetElement.dataset;
      const node = findTargetNode(nodeData, JSON.parse(folderTreePath!));
      electron.showContentMenu({
        x: clientX,
        y: clientY,
        type: node.type == 'directory' ? 'file-tree-item-directory' : 'file-tree-item-file',
        data: node.id,
      });
    },
    [JSON.stringify(nodeData)],
  );

  return [nodeData, onTreeStateChange, onNameClick, onContextMenu];
};

export const useFileTree = useFileTreeImpl;
