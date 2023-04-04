import type { FC } from 'react';
import './LogView.css';

import { LogViewer, LogViewerSearch } from '@patternfly/react-log-viewer';
import { Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { useLog } from '../../hooks/useLog';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store/root';
import { MButton } from '../common/Button';

export const LogView: FC = () => {
  const log = useSelector((state: RootState) => state.log);
  const [, reloadLog] = useLog();

  return (
    <>
      <MButton onClick={_e => reloadLog(log.logFile)}>Reload log</MButton>
      <div style={{ height: '90%' }}>
        <LogViewer
          hasLineNumbers={false}
          data={log.logData}
          theme="light"
          isTextWrapped={true}
          height="100%"
          scrollToRow={log.logData.length}
          toolbar={
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>
                  <LogViewerSearch
                    minSearchChars={3}
                    placeholder="Search value"
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
          }
        />
      </div>
    </>
  );
};
