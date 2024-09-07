import { useMemo } from 'react';
import { PhyRenderedContent } from './PhyRenderedContent';
import { TxtRenderedContent } from './TxtRenderedContent';

import type { RootState } from '../../redux/store/root';
import { useSelector } from 'react-redux';
import { SourceWarning } from './SourceWarning';

export const ContentView = () => {
  const contentFile = useSelector((state: RootState) => state.contentFile);

  const renderComponent = useMemo(() => {
    if (!contentFile.content) {
      return (
        <div>
          <span>File is empty!</span>
        </div>
      );
    }
    if (contentFile.name.endsWith('.phy')) {
      return (
        <PhyRenderedContent
          content={contentFile.content}
          className="content-view"
        />
      );
    }
    return (
      <TxtRenderedContent
        content={contentFile.content}
        className="content-view"
      />
    );
  }, [contentFile.content]);

  if (!contentFile.name) {
    return (
      <div>
        <span>You can open file in explorer to start working!</span>
      </div>
    );
  }

  return (
    <div style={{ height: '100%' }}>
      <SourceWarning />
      {renderComponent}
    </div>
  );
};
