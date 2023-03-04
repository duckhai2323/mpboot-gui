import React from "react";
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
import "./FileTree.css";
import { useFileTree } from "../../hooks/useFileTree";


export const FileTree = () => {
    const [nodeData, onTreeStateChange, onNameClick] = useFileTree()

    if (!nodeData) return <div></div>

    return (
        <div>
            <FolderTree
                data={nodeData}
                onChange={onTreeStateChange}
                showCheckbox={false}
                onNameClick={onNameClick}
                indentPixels={10}
                readOnly
            />
        </div>

    )
}
