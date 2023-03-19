import { Allotment } from 'allotment';
import React from 'react';
import { Link } from 'react-router-dom';
import { useWindowSize } from 'usehooks-ts';
import { ContentView } from '../components/ContentView/ContentView';
import { FileTree } from '../components/FileTree/FileTree';
import { LogView } from '../components/LogView/LogView';
import { ParameterView } from '../components/ParameterView/ParameterView';
import 'allotment/dist/style.css';
import './main.css';
import { TreePreviewWithSize } from '../components/TreePreview/TreePreview';

export const MainPage = () => {
  const size = useWindowSize();
  return (
    <Allotment>
      <Allotment.Pane
        minSize={size.width * 0.1}
        preferredSize={size.width * 0.2}
        className="allotment__pane--scroll-on-overflow-y"
      >
        <FileTree />
      </Allotment.Pane>
      <Allotment.Pane
        minSize={size.width * 0.3}
        preferredSize={size.width * 0.3}
      >
        <Allotment vertical>
          <Allotment.Pane className="allotment__pane--scroll-on-overflow-x allotment__pane--scroll-on-overflow-y">
            <ContentView />
          </Allotment.Pane>
          <Allotment.Pane>
            <LogView />
          </Allotment.Pane>
        </Allotment>
      </Allotment.Pane>
      <Allotment.Pane
        minSize={size.width * 0.3}
        preferredSize={size.width * 0.3}
      >
        <Allotment vertical>
          <Allotment.Pane>
            <ParameterView />
          </Allotment.Pane>
          <Allotment.Pane>
            <Link to="/tree-view">Tree View</Link>
            <TreePreviewWithSize
              width="100%"
              height="90%"
              mode="normal"
            />
          </Allotment.Pane>
        </Allotment>
      </Allotment.Pane>
    </Allotment>
  );
};
