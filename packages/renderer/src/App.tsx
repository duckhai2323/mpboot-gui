import React from 'react';
import SplitPane from 'react-split-pane';
// @ts-ignore
import Pane from 'react-split-pane/lib/Pane';
import './App.css';
import { ContentView } from './components/ContentView';
import { FileTree } from './components/FileTree';
import { LogView } from './components/LogView';
import { ParameterView } from './components/ParameterView';
import { TreeView } from './components/TreeView';
import { useWindowSize } from 'usehooks-ts';

function App() {
	const size = useWindowSize();
	return (
		<div style={{width: size.width, height: size.height}}>
			{/* @ts-ignore */}
			<SplitPane split="vertical">
				<Pane minSize="10%" maxSize="60%" initialSize="10%">
					<FileTree />
				</Pane>
				{/* @ts-ignore */}
				<SplitPane split="horizontal" minSize="20%" maxSize="60%">
					<Pane minSize="70%">
						<ContentView />
					</Pane>
					<Pane minSize="30%">
						<LogView />
					</Pane>
				</SplitPane>
				{/* @ts-ignore */}
				<SplitPane split="horizontal" minSize="20%" maxSize="60%" initialSize="20%">
					<Pane >
						<ParameterView />
					</Pane>
					<Pane >
						<TreeView />
					</Pane>
				</SplitPane>

			</SplitPane>
		</div>
	)
}


export default App;
