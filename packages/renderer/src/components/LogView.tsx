import React, { FC, useEffect, useState } from "react";
import { LazyLog } from 'react-lazylog'
// @ts-ignore
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

    const onButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        (async () => {
            const logFile = await electron.generateLog()
            setLogFileName(logFile)
        })()
    }
    return (
        <div style={{ height: "100%" }}>
            {
                log == "" ?
                    <button onClick={onButtonClick} color="red">Generate Log</button>
                    :
                    <LazyLog
                        text={log}
                        follow
                        extraLines={1}
                        selectableLines
                    />
            }
        </div>

    );
};