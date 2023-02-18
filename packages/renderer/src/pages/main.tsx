import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SplitPane from 'react-split-pane';
// @ts-ignore
import Pane from 'react-split-pane/lib/Pane';
import { useWindowSize } from 'usehooks-ts';
import { ContentView } from '../components/ContentView/ContentView';
import { FileTree } from '../components/FileTree/FileTree';
import { LogView } from '../components/LogView/LogView';
import { ParameterView } from '../components/ParameterView/ParameterView';
import { TreeView } from '../components/TreeView/TreeView';

export const MainPage = () => {
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
                        <Link to="/tree-view">Tree View</Link>
						<TreeView width={300} height={400} mode="normal"/>
					</Pane>
				</SplitPane>

			</SplitPane>
		</div>
	)
}
