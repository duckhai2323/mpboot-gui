import React, { FC, useEffect, useState } from "react";
import { LogViewer } from 'react-log-output'
import { useElectron } from "../hooks/useElectron";
export interface LogViewProps {

}

export const LogView: FC = (props: LogViewProps) => {
    const [log, setLog] = useState<string>("")
    const [logFileName, setLogFileName] = useState<string>("")
    const electron = useElectron()
    // useEffect(() => {
    //     (async () => {
    //         const filename = await electron.generateLog()
    //         setLogFileName(filename)
    //     })()
    // }, [])

    useEffect(() => {
        if (!logFileName) return
        const logStream = electron.subscribeLog(logFileName)
        logStream.on("data", (data) => {
            setLog((prev) => prev ? prev + "\n" + data : data)
        })
        return () => {
            logStream.unregister()
        }
    }, [logFileName])

    const onButtonClick = (e : React.MouseEvent) => {
        e.preventDefault();
        (async () => {
            const logFile = await electron.generateLog()
            setLogFileName(logFile)
        })()
    }
    return (
        <div>
            <button onClick={onButtonClick} color="red">Generate Log</button>
            <LogViewer text={log} style={{ width: "1200px", maxHeight: "600px" }} />
        </div>
    );
};