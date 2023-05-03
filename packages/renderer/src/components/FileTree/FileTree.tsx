import FolderTree from '@aqaurius6666/react-folder-tree';

import { useFileTree } from '../../hooks/useFileTree';

export const FileTree = () => {
  const [nodeData, onTreeStateChange, onNameClick, onContextMenu] = useFileTree();

  if (!nodeData) return <div></div>;

  return (
    <div onContextMenu={onContextMenu}>
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
