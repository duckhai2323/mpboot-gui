import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/main';
import { TreeViewPage } from './pages/tree-view';

function App() {
	return (
		<HashRouter>
			<Routes>
				<Route path={"/"} element={<MainPage />} />
				<Route path={"/main"} element={<MainPage />} />
				<Route path={"/tree-view"} element={<TreeViewPage />} />
			</Routes>
		</HashRouter>
	)
}

export default App;
