import React from 'react';
import { Link } from 'react-router';
import Store from '../../lib/store';
import Constants from '../../lib/constants';

export default React.createClass({
    displayName: 'User',
    getInitialState() {
        return Store.user.value;
    },
    componentWillMount() {
        this.onLogout = () => {
            Store.user.onNext(Constants.user);
        }
    },
    render() {
        return this.state.email === '' ?
            (<div className="btns-group">
                <Link to="/signin" className="btn-secondary">Sign In</Link>
                <Link to="/join" className="btn-secondary">Join</Link>
            </div>) :
            (<div className="btns-group-vertical">
                <a className="js-user-menu btn-secondary" href="#">
                    <span className="icon-arrow-up"/>
                    {this.state.email}
                </a>
                <a className='js-logout btn-secondary' onClick={this.onLogout}>LOGOUT</a>
            </div>);
    },
    componentDidMount() {
        Store.user.skip(1).subscribe(user => {
            console.log('User componentWillMount', user);
            this.setState(user);
        });
    }
});

