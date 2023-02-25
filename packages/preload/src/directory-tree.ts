import { ipcRenderer } from "electron"
import { Directory } from "../../common/directory-tree"
import { IPC_EVENTS } from "../../common/ipc"

export const getFirstLoadDirectoryTree = async (dirPath: string): Promise<Directory> => {
    const result = await ipcRenderer.invoke(IPC_EVENTS.DIRECTORY_TREE_FIRST_LOAD, dirPath)
    return result as Directory
}

export const subscribeDirectoryTree = (dirPath: string) => {
    return {
        on: (event: string, callback: (data: any) => void) => {
            console.log("on")
        },
        unregister: () => {
            console.log("unregister")
        }
    }
}


export const exploreDirectory = async (dirPath: string, dirToExplore: string): Promise<Directory> => {
    const result = await ipcRenderer.invoke(IPC_EVENTS.DIRECTORY_TREE_EXPLORE_DIRECTORY, {dirPath, dirToExplore})
    return result as Directory;
}