import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Actions } from "../redux/slice/log.slice"
import { LogState } from "../redux/state/log.state"
import { RootState } from "../redux/store/root"
import { useElectron } from "./useElectron"

export const useLog = (): [logState : LogState, setLogFile : (filePath: string) => void] => {
    const logState = useSelector((state: RootState) => state.log)
    const [isGenerating, setGenerating] = useState(false)
    const dispatch = useDispatch()
    const electron = useElectron()
    const setLogFile = useCallback((filePath: string) => {
        dispatch(Actions.setLogFile({
            logFile: filePath
        }))
        setGenerating(true)
    }, [])

    useEffect(() => {
        if (!isGenerating) {
            return
        }
        const logStream = electron.subscribeLog(logState.logFile)
        logStream.on("data", (data: string) => {
            dispatch(Actions.appendLogData({
                logData: [data]
            }))
        })
        return () => {
            logStream.unregister()
        }
    }, [logState.logFile, isGenerating])

    return [logState, setLogFile]
}