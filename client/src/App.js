import React from 'react';
import io from 'socket.io-client';
import './App.css';
import Login from './login/Login';
import Board from './board/Board';
import HeaderBar from './common/HeaderBar';
import BoardList from './board-list/BoardList';

class App extends React.Component {
  constructor(props) {
    super(props);

    const socket = io.connect('http://localhost:3001', { transports: ['websocket', 'polling', 'flashsocket'] });
    socket.on('connect', this.socketConnect);

    const user = localStorage.getItem('username');
    this.state = {
      username: user,
      boardId: null,
      socket,
    };

    // get the board id from the url (if there is one)
    const urlParams = new URLSearchParams(window.location.search);
    const boardId = urlParams.get('board');
    if (boardId) {
      this.setState({ boardId });
    }
  }

  socketConnect = () => {
    if (this.state.username) {
      this.state.socket.emit('login', { username: this.state.username });
    }
  }

  onLogin = (username) => {
    this.setState({ username });
    localStorage.setItem('username', username);
  }

  openBoard = (boardId) => {
    this.setState({ boardId });
  }

  boardDeleted = (boardId) => {
    if (this.state.boardId === boardId) {
      this.setState({ boardId: null });
    }
  }

  render() {
    return (
      <div className="App">
        <HeaderBar></HeaderBar>

        { !this.state.username && <Login socket={this.state.socket} login={this.onLogin} /> }

        { this.state.username && 
          <div className="container">
            <div className="board-list-container">
              <BoardList socket={this.state.socket} user={this.state.username} openBoard={this.openBoard} boardDeleted={this.boardDeleted} boardId={this.state.boardId} />
            </div>

              <div className="board-container">
                { this.state.boardId && <Board id={this.state.boardId} socket={this.state.socket} user={this.state.username} /> }

                { !this.state.boardId && 
                  <div className="no-board-selected">
                    <div className="no-board-msg">Select a board on the left or create a new one.</div>
                  </div>
                }
              </div>
          </div> 
        }
      </div>
    );
  }
}

export default App;
