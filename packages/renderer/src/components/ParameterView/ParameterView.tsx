import React, { useCallback } from 'react';
import Collapsible from 'react-collapsible';
import { useSelector } from 'react-redux';
import { useElectron } from '../../hooks/useElectron';
import { useLog } from '../../hooks/useLog';
import { usePhylogenTree } from '../../hooks/usePhylogenTree';
import { RootState } from '../../redux/store/root';
import { InputDataType } from './InputDataType';
import { OutputPrefix } from './OutputPrefix';
import { Sources } from './Sources';
import { Treefile } from './Treefile';
import './ParameterView.css';

export const ParameterView = () => {
    const parameter = useSelector((state: RootState) => state.parameter)
    const [subscribeLog] = useLog();
    const [, subscribeCommand] = usePhylogenTree()
    const electron = useElectron()

    const onRunButtonSubmit: React.FormEventHandler<HTMLButtonElement> = useCallback((e) => {
        e.preventDefault();
        (async () => {
            const { logFile, commandId } = await electron.executeCommand(parameter)
            subscribeLog(logFile)
            subscribeCommand(commandId)
        })()
    }, [parameter])


    return (
        <>
            <button id="run-button" onClick={onRunButtonSubmit}>Run</button>
            <Collapsible trigger={"Basic parameters"} transitionTime={1} >
            <table>
                <Sources source={parameter.source} multiSources={parameter.multiSources} />
                <Treefile />
                <InputDataType />
                <OutputPrefix />
            </table>
            </Collapsible>
            <Collapsible trigger={"Advance parameters"} transitionTime={1} >
            <table>
                <Sources source={parameter.source} multiSources={parameter.multiSources} />
                <Treefile />
                <InputDataType />
                <OutputPrefix />
            </table>
            </Collapsible>
            
        </>
    )
}