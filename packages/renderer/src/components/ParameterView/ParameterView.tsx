import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { logger } from '../../../../common/logger';
import { useElectron } from '../../hooks/useElectron';
import { useLog } from '../../hooks/useLog';
import { usePhylogenTree } from '../../hooks/usePhylogenTree';
import { useWorkspace } from '../../hooks/useWorkspace';
import { RootState } from '../../redux/store/root';

export const ParameterView = () => {
    const parameter = useSelector((state: RootState) => state.parameter)
    const [, setLogFile] = useLog();
    const [, getRelativePath] = useWorkspace()
    const [newick, , subscribeCommand] = usePhylogenTree()
    const electron = useElectron()
    
    const onRunButtonSubmit : React.FormEventHandler<HTMLButtonElement> = useCallback((e) => {
        e.preventDefault();
        logger.log("run button clicked", {parameter});
        (async () => {
            const {logFile, commandId} = await electron.executeCommand(parameter)
            setLogFile(logFile)
            subscribeCommand(commandId)
        })()
    }, [parameter, electron])

    return (
        <>
            <button id="run-button"  onClick={onRunButtonSubmit}>Run</button>
            {/* <input id="source-input" type="text" readOnly>{parameter.source}</input> */}
            <div>{getRelativePath(parameter.source)}</div>
        </>
    )
}