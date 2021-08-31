import React from 'react';
import BoardItem from './BoardItem';
import './BoardList.css';
import NewBoard from './NewBoard';

class BoardList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            boards: [],
            newBoard: false,
            newBoardTitle: '',
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
        if (this.state.selectNewBoard && data.length > 0) {
            this.props.openBoard(data[0].id);
            this.setState({ selectNewBoard: false });
        }

        this.setState({ boards: data });
    }

    showCreateBoard = () => {
        this.setState({ newBoard: true, newBoardTitle: '' });
    }

    handleCreateBoard = (title) => {
        this.createBoard(title);

        // reset the input form
        this.setState({
            newBoard: false,
            newBoardTitle: ''
        });
    }

    abortCreateBoard = () => {
        this.setState({ newBoard: false, newBoardTitle: '' });
    }

    createBoard(title) {
        this.props.socket.emit('create-board', { title });
        this.setState({ selectNewBoard: true });
    }

    editBoard(boardId, title) {
        this.props.socket.emit('update-board', { boardId, title });
    }

    render() {
        const boardItems = this.state.boards.map(b => (
            <BoardItem key={b.id} boardId={b.id} title={b.title} openBoard={() => this.props.openBoard(b.id)} selected={this.props.boardId === b.id} editBoard={(boardId, title) => this.editBoard(boardId, title)} />
        ));

        return (
            <div className="board-list">
                {!this.state.newBoard && <button className="primary-action-btn new-board-btn" onClick={this.showCreateBoard}>+ Create new board</button>}
                {this.state.newBoard && <NewBoard title={this.state.newBoardTitle} add={(title) => this.handleCreateBoard(title)} abort={this.abortCreateBoard} />}
                
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