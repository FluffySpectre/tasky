import React from 'react';
import './Login.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
        };
    }

    handleTextChange = (event) => {
        this.setState({ username: event.target.value });
    }

    handleKeyUp = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.login();
        }
    }

    login = () => {
        this.props.socket.emit('login', { username: this.state.username });
        this.props.login(this.state.username);
    }

    render() {
        return (
            <div className="login">
                <div className="login-box">
                    <input className="username" type="text" placeholder="Enter your username..." value={this.state.username} onChange={this.handleTextChange} onKeyUp={this.handleKeyUp} />
                    <button className="primary-action-btn login-btn" onClick={this.login}>BEGIN</button>
                </div>
            </div>
        );
    }
}

export default Login;