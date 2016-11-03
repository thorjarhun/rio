import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';

import App from './views/App';
import SignIn from './views/SignIn';
import Join from './views/Join';
import Tasks from './views/list/Tasks';
import './transfer';

var routes = (
    <Route path="/" component={App}>
        <IndexRoute component={Tasks}/>
        <Route path="/tasks/:name" component={Tasks}/>
        <Route path="signin" component={SignIn}/>
        <Route path="join" component={Join}/>
    </Route>
);

render(<Router history={browserHistory}>{routes}</Router>, document.getElementById('app'));

// <ListsShow title={Store.lists[0].title} items={Store.lists[0].items} />
