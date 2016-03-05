import Warpedit from './warpedit';
import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import store from './lib/store';

export default (
  <Provider store={ store }>
    <Router history={ browserHistory }>
      <Route path="/" component={ Warpedit }>
      <Route path="/edit/:site/:post" component={ Warpedit }/>
      </Route>
    </Router>
  </Provider>
);
