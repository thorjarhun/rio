import React from 'react';
import Notifications from './Notifications';
import ListTodos from './ListTodos.jsx';
import User from './User.jsx';

const App = ({children}) => {
    return (
        <div id="container">
             <section id="menu">
                <User />
                <ListTodos />
            </section>
            <div className="content-overlay"></div>

            <div id="content-container">
                {children}
            </div>
        </div>
    );
};

export default App;

//Below  <div className="content-overlay"></div>
// <Notifications />
