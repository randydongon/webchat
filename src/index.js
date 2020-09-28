import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { StateProvider } from './StateProvider';
import reducer, { initialState } from './reducer';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/js/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

ReactDOM.render(

  <StateProvider reducer={reducer} initialState={initialState}>
    <Router>
      <Header className='appbar' />
      <Switch>
        <Route exact path="/webchat" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/profile" component={Profile} />
      </Switch>
    </Router>
  </StateProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
