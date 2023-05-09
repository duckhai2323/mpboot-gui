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
          <h1>File is empty!</h1>
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
        <h1>You can open file in explorer to start working!</h1>
      </div>
    );
  }

  return <div style={{ height: '100%' }}>
    <SourceWarning />
    {renderComponent}
  </div>;
};
