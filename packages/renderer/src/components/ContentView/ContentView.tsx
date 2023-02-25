import React, { useEffect, useState } from 'react';
import { useContentView } from '../../hooks/useContentView';

export const ContentView = () => {
    const [contentFile, openFile] = useContentView();
    
    if (!contentFile.name) {
        return (
            <div>
                <h1>You can open file in explorer to start working!</h1>
            </div>
        )
    }
    return (
        <>
            <div style={{whiteSpace: "pre-wrap"}}>
                {contentFile.content}
            </div>
        </>
    )
}