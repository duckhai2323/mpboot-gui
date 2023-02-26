import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { SingletonHooksContainer } from 'react-singleton-hook';
import App from './App';
import './index.css';
import { store } from './redux/store/root';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
			<SingletonHooksContainer />
			<App />
		</Provider>
	</React.StrictMode>,
);
