import React from 'react';
import { render } from 'react-dom';
import { Route, Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import reducer from './reducers';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import App from './components/App';
import NotFound from './components/NotFound';
import Organizations from './components/Organizations';
import Repositories from './components/Repositories';
import Signin from './components/Signin';
import { setAccessToken } from './helpers/github';

const element = document.getElementById('app-root');
const accessToken = element.getAttribute('data-access-token');

const middleware = [thunk()];
if (process.env.NODE_ENV !== 'production') { // eslint-disable-line no-process-env
  middleware.push(createLogger());
}
const store = createStore(reducer, applyMiddleware(...middleware));

if (!accessToken) {
  render(<Signin />, element);
} else {
  setAccessToken(accessToken);
  render(
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path='' component={App}>
          <Route path='/' component={Organizations} />
          <Route path='/:org' component={Repositories} />
        </Route>
        <Route path='*' component={NotFound} />
      </Router>
    </Provider>
    , element);
}
