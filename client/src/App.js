import React from 'react';
import './App.css';
import Board from './board/Board';
import io from 'socket.io-client';

const socket = io.connect('http://192.168.1.5:3001', { transports: ['websocket', 'polling', 'flashsocket'] });

class App extends React.Component {
  render() {
    // get the board id from the url (if there is one)
    const urlParams = new URLSearchParams(window.location.search);
    const boardId = urlParams.get('board');

    return (
      <div className="App">
          <Board id={boardId} socket={socket} />
      </div>
    );
  }
}

export default App;
