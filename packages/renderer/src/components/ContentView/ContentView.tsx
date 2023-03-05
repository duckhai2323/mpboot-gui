import React, { useCallback, useMemo } from 'react';
import { useContentView } from '../../hooks/useContentView';

export const ContentView = () => {
    const [contentFile,] = useContentView();


    const getColorForADN = useCallback((char: string) => {
        const colors = {
            A: 'blue',
            T: 'cyan',
            G: 'teal',
            X: 'purple',
            N: 'violet',
            C: 'magenta'
        };
        return (colors as any)[char] || 'black'
    }, [])

    const renderContent = useMemo(() => {
        const content = contentFile.content
        if (!content) return <></>
        let components = []
        let lastCharacters = content[0]
        for (let i = 1; i < content.length; i++) {
            if (lastCharacters[0] !== content[i]) {
                components.push(<span style={{ color: getColorForADN(lastCharacters[0]) }}>{lastCharacters}</span>)
                lastCharacters = content[i]
            } else {
                lastCharacters += content[i]
            }
        }
        components.push(<span style={{ color: getColorForADN(lastCharacters[0]) }}>{lastCharacters}</span>)
        return (
            <>
                {components}
            </>
        )
    }, [contentFile.content])
    if (!contentFile.name) {
        return (
            <div>
                <h1>You can open file in explorer to start working!</h1>
            </div>
        )
    }
    return (
        <>
            <pre>
                {renderContent}
            </pre>
        </>
    )
}

