import React from 'react';
import { Link } from 'react-router';
import Util from '../../lib/util';
import Store from '../../lib/store';

export default React.createClass({
    displayName: 'Join',
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState() {
      return { errors: [] };
    },
    componentWillMount() {
        Store.joinResult.skip(1).subscribe(res => {
            if(res.hasOwnProperty('errors')){
                this.setState({ errors: res.errors });
            } else {
                Store.user.onNext(res);
                this.context.router.transitionTo('/');
            }
        });
    },
    onJoin(e) {
        e.preventDefault();
        var errors = validateJoin(this.refs.email.value,
            this.refs.password.value, this.refs.confirm.value);
        if(errors.length)  {
            this.setState({errors: errors});
        } else {
            var email = React.findDOMNode(this.refs.email).value;
            var password = React.findDOMNode(this.refs.password).value;
            console.log('onJoin',email,password);
            Store.joinRequest.onNext({
                email,
                password
            });
        }
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
                        <h1 className="title-auth">Join.</h1>
                        <p className="subtitle-auth">Joining allows you to make private lists</p>
                        <form onSubmit={this.onJoin}>
                            <div className="input-symbol">
                                <input type="email" name="email" ref='email' placeholder="Your Email"/>
                                <span className="icon-email" title="Your Email"/>
                            </div>
                            <div className="input-symbol">
                                <input type="password" name="password" ref='password' placeholder="Password"/>
                                <span className="icon-lock" title="Password"/>
                            </div>
                            <div className="input-symbol">
                                <input type="password" name="confirm" ref='confirm' placeholder="Confirm Password"/>
                                <span className="icon-lock" title="Confirm Password"/>
                            </div>
                            <button type="submit" className="btn-primary">Join Now</button>
                        </form>
                    </div>
                    <Link to="signin" className="link-auth-alt">Have an account? Sign in</Link>
                </div>
            </div>
        );
    }
});

function validateJoin(email,password,confirm) {
    var errors = [];
    if(Util.validateEmail(email)) {
        errors.push('Invalid email');
    }
    if(Util.validatePassword(password)) {
        errors.push('Invalid password');
    }
    if(password !== confirm) {
        errors.push('Passwords do not match');
    }
    return errors;
}
