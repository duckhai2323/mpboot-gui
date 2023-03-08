import React, { FC, useEffect, useState } from "react";
import './LogView.css';
import "@patternfly/react-core/dist/styles/base.css";
import { useElectron } from "../../hooks/useElectron";
import { LogViewer, LogViewerSearch } from "@patternfly/react-log-viewer";
import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { useLog } from "../../hooks/useLog";
import { usePhylogenTree } from "../../hooks/usePhylogenTree";

export interface LogViewProps {

}

export const LogView: FC = (props: LogViewProps) => {
    const [logData, , reloadLog] = useLog()


    return (
        <>
            <button onClick={reloadLog}>Reload log</button>
            <div style={{ height: "90%" }}>
                <LogViewer
                    hasLineNumbers={false}
                    data={logData}
                    theme="light"
                    isTextWrapped={true}
                    height="100%"
                    scrollToRow={logData.length}
                    toolbar={
                        <Toolbar>
                            <ToolbarContent>
                                <ToolbarItem>
                                    <LogViewerSearch minSearchChars={3} placeholder="Search value" />
                                </ToolbarItem>
                            </ToolbarContent>
                        </Toolbar>
                    }
                />
            </div>
        </>


    );
};