import React from 'react';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Provider } from 'react-redux';

import Warpedit from './warpedit';
import store from './lib/store';

const history = createBrowserHistory();

export default (
	<Provider store={ store }>
		<Router history={ history }>
			<Route path="/edit/:site/:post" component={ Warpedit }/>
			<Route path="/" component={ Warpedit }/>
		</Router>
	</Provider>
);
