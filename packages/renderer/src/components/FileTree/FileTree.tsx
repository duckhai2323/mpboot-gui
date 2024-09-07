import FolderTree from '@khaitd0340/react-folder-tree';

import { useFileTree } from '../../hooks/useFileTree';

export const FileTree = () => {
  const [nodeData, onTreeStateChange, onNameClick, onContextMenu] = useFileTree();

  if (!nodeData) return <div></div>;

  return (
    <div
      onContextMenu={onContextMenu}
      style={{ paddingLeft: '15px', paddingTop: '15px' }}
    >
      <FolderTree
        data={nodeData}
        onChange={onTreeStateChange}
        showCheckbox={true}
        onNameClick={onNameClick}
        indentPixels={10}
      />
    </div>
  );
};
