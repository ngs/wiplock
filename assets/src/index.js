import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import reducers from './reducers';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import App from './components/App';
import Repositories from './components/Repositories';
import Signin from './components/Signin';

const element = document.getElementById('app-root');
const accessToken = element.getAttribute('data-access-token');

const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') { // eslint-disable-line no-process-env
  middleware.push(createLogger());
}
const store = createStore(reducers, applyMiddleware(...middleware));

if (!accessToken) {
  render(<Signin />, element);
} else {
  render(
    <Provider store={store}>
      <App>
        <Repositories />
      </App>
    </Provider>
    , element);
}
