import React, { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/main';
import { TreeViewPage } from './pages/tree-view';
import "./App.css";
import { useWindowSize } from 'usehooks-ts';
import { useElectron } from './hooks/useElectron';
import { DashboardPage } from './pages/dashboard';

function App() {
	const size = useWindowSize();
	const electron = useElectron()
	const [errMsg, setErrMsg] = React.useState<string>("")

	useEffect(() => {
		if (!electron || typeof electron.testAvailable !== "function") return;
		
		electron.testAvailable().then((res) => {
			if (!res) {
				setErrMsg("mpboot executable is not available")
			} else {
				setErrMsg("")
			}
		})
	}, [electron])

	if (!electron || typeof electron.testAvailable !== "function") {
		return (
			<div>
				<div>We are really sorry that MpbootGUI is not currently working as expected. Please contact us for more support.</div>
				<h1>electron is not available</h1>
			</div>
		)
	}


	if (errMsg) {
		return (
			<div>
				<div>We are really sorry that MpbootGUI is not currently working as expected. Please contact us for more support.</div>
				<h1>{errMsg}</h1>
			</div>
		)
	}
	return (

		<div style={{ width: size.width, height: size.height }}>
			<HashRouter>
				<Routes>
					<Route path="/dashboard" element={<DashboardPage />} />
					<Route path="/main" element={<MainPage />} />
					<Route path="/tree-view" element={<TreeViewPage />} />
					<Route path='*' element={<DashboardPage />} />
				</Routes>
			</HashRouter>
		</div>

	)
}

export default App;
