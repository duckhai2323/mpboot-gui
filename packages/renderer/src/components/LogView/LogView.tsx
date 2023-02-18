import React, { FC, useEffect, useState } from "react";
import { LazyLog } from 'react-lazylog'
// @ts-ignore
import { useElectron } from "../../hooks/useElectron";
// @ts-ignore
import * as phylotree from 'phylotree';
export interface LogViewProps {

}

export const LogView: FC = (props: LogViewProps) => {
    const [log, setLog] = useState<string>("")
    const [logFileName, setLogFileName] = useState<string>("")
    const electron = useElectron()

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

    useEffect(() => {
        (async () => {
            const tree = new phylotree.phylotree("");
            console.log(tree)
        })()
    }, [])

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
                    <div style={{width: "100%", height: "95%"}}>
                        <LazyLog
                            text={log}
                            follow
                            extraLines={3}
                            selectableLines
                            enableSearch
                        />
                    </div>
            }
        </div>

    );
};