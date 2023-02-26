import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/main';
import { TreeViewPage } from './pages/tree-view';
import "./App.css";
import { useWindowSize } from 'usehooks-ts';
import { useElectron } from './hooks/useElectron';

function App() {
	const size = useWindowSize();
	const electron = useElectron()
	if (!electron || typeof electron.testAvailable !== "function") {
		return (
			<div>
				<h1>Electron is not available</h1>
			</div>
		)
	}
	return (
		<div style={{ width: size.width, height: size.height }}>
			<HashRouter>
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/main" element={<MainPage />} />
					<Route path="/tree-view" element={<TreeViewPage />} />
					<Route path='*' element={<MainPage />} />
				</Routes>
			</HashRouter>
		</div>

	)
}

export default App;
