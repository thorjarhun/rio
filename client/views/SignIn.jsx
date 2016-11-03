import React from 'react';
import { Link } from 'react-router';
import Store from '../../lib/store';

export default React.createClass({
    displayName: 'SignIn',
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState() {
        return {
            enabled: false,
            errors: []
        };
    },
    onSignIn(e) {
        e.preventDefault();
        var email = React.findDOMNode(this.refs.email).value;
        var password = React.findDOMNode(this.refs.password).value;
        Store.signInRequest.onNext({
            email,
            password
        });
    },
    render() {
        return (
            <div className="page auth">
                <nav>
                    <div className="nav-group">
                        <a href="#" className="js-menu nav-item">
                            <span className="icon-list-unordered"/>
                        </a>
                    </div>
                </nav>
                <div className="content-scrollable">
                    <div className="wrapper-auth">
                        <h1 className="title-auth">Sign In.</h1>
                        <p className="subtitle-auth">Signing in allows you to view private lists</p>
                        <form onSubmit={this.onSignIn}>
                            <div className="list-errors">
                                <div className="list-item"></div>
                            </div>
                            <div className="input-symbol">
                                <input type="email" name="email" placeholder="Your Email" ref='email'/>
                                <span className="icon-email" title="Your Email"/>
                            </div>
                            <div className="input-symbol">
                                <input type="password" name="password" placeholder="Password" ref='password'/>
                                <span className="icon-lock" title="Password"/>
                            </div>
                            <button type="submit" className="btn-primary">Sign in</button>
                        </form>
                    </div>
                    <Link to="join" className="link-auth-alt">Need an account? Join Now.</Link>
                </div>
            </div>
        );
    }
});
