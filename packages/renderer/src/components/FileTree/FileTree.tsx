import React, { useCallback, useEffect } from "react";
import { logger } from "../../../../common/logger";
import { useElectron } from "../../hooks/useElectron";
import FolderTree, { NodeData } from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
import { convertDirectoryToNodeData, findNodeDataAndUpdate, getRelativePath } from "./convert-directory-to-node-data";
import { Directory } from "../../../../common/directory-tree";
import "./FileTree.css";
import { useContentView } from "../../hooks/useContentView";
import { useParameter } from "../../hooks/useParameter";
import { useWorkspace } from "../../hooks/useWorkspace";


export const FileTree = () => {
    const [projectPath] = useWorkspace()
    const [_, openFile] = useContentView();
    const [parameterState, setSource] = useParameter();
    const electron = useElectron();
    const [nodeData, setNodeData] = React.useState<NodeData>();

    useEffect(() => {
        (async () => {
        if (!electron) return

            const directory = await electron.getFirstLoadDirectoryTree(projectPath)
            setNodeData(convertDirectoryToNodeData(directory))
        })()
    }, [electron])

    // useEffect(() => {
    //     if (!nodeData) return

    //     const emitter = electron.subscribeDirectoryTree(projectPath)
    //     emitter.on("data", (data) => {
    //         console.log(data)
    //     })
    //     return () => {
    //         emitter.unregister()
    //     }

    // }, [nodeData])

    const onTreeStateChange = (state: any, event: any) => {
        logger.log("state change", { state, event })
    };
    const onNameClick = useCallback(({ defaultOnClick, nodeData: clickedNodeData }: {
        defaultOnClick: () => void;
        nodeData: NodeData;
    }) => {
        if (!nodeData) return

        if (clickedNodeData.type === "file") {
            openFile(clickedNodeData.id)
            setSource(clickedNodeData.id)
        }
        if (clickedNodeData.type === "directory") {
            if (clickedNodeData.explored) {
                clickedNodeData.isOpen = !clickedNodeData.isOpen
            } else {
                electron.exploreDirectory(projectPath, getRelativePath(projectPath, clickedNodeData.id)).then(async (data: Directory) => {
                    const node = convertDirectoryToNodeData(data)
                    const _tmp = { ...nodeData }
                    console.log("current nodeData", _tmp)
                    findNodeDataAndUpdate(_tmp, node.id, (found) => {
                        found.children = node.children
                        found.explored = true
                        found.isOpen = true
                    })
                    setNodeData((_node) => _tmp)
                })
            }

        }
        defaultOnClick()

    }, [JSON.stringify(nodeData), nodeData])

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
