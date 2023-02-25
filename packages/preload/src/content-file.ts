import { ipcRenderer } from "electron"
import { ContentFile } from "../../common/content-file"
import { IPC_EVENTS } from "../../common/ipc"
import { logger } from "../../common/logger"

export const openContentFile = async (filePath: string) : Promise<ContentFile> => {
    const result = await ipcRenderer.invoke(IPC_EVENTS.CONTENT_FILE_OPEN, filePath)
    return result as ContentFile
}

export const readContentFile = async (filePath: string) : Promise<string> => {
    const result = await ipcRenderer.invoke(IPC_EVENTS.CONTENT_FILE_READ, filePath)
    return result as string
}
