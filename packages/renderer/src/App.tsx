import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/main';
import { TreeViewPage } from './pages/tree-view';
import "./App.css";
import { useWindowSize } from 'usehooks-ts';
import { Provider } from 'react-redux';
import { store } from './redux/store/root';
import { SingletonHooksContainer } from 'react-singleton-hook';

function App() {
	const size = useWindowSize();
	return (
		<Provider store={store}>
			<SingletonHooksContainer />
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
		</Provider>

	)
}

export default App;
