import React from 'react';
import BoardItem from './BoardItem';
import './BoardList.css';

class BoardList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            boards: []
        };
    }

    componentDidMount() {
        // subscribe for board list updates and do an initial request
        this.props.socket.on('board-list', this.socketOnBoardList);
        this.props.socket.emit('board-list');
    }

    componentWillUnmount() {
        this.props.socket.off('board-list', this.socketOnBoardList);
    }

    socketOnBoardList = (data) => {
        this.setState({ boards: data });
    }

    openAddBoard = () => {
        this.props.socket.emit('create-board', { title: 'HALLO WELT' + Math.random() });
    }

    render() {
        const boardItems = this.state.boards.map(b => (
            <BoardItem key={b.id} boardId={b.id} title={b.title} openBoard={() => this.props.openBoard(b.id)} selected={this.props.boardId === b.id} />
        ));

        return (
            <div className="board-list">
                <button className="primary-action-btn new-board-btn" onClick={this.openAddBoard}>+ Create new board</button>
                <div className="boards">
                    <div style={{ width: '100%' }}>
                        {boardItems}
                    </div>
                </div>
            </div>
        );
    }
}

export default BoardList;