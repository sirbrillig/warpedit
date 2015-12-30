import React from 'react';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'

import Warpedit from './warpedit';

const history = createBrowserHistory();

export default (
	<Router history={ history }>
		<Route path="/edit/:site/:post" component={ Warpedit }/>
		<Route path="/" component={ Warpedit }/>
	</Router>
);
