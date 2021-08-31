import React from 'react';
import './BoardItem.css';

class BoardItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            title: props.title
        };
    }
    
    showEdit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        this.setState({ edit: true });
    }

    handleSubmit = () => {
        this.props.editBoard(this.props.boardId, this.state.title);
        this.setState({ edit: false });
    }

    handleCancel = () => {
        this.setState({ edit: false });
    }

    handleTextChange = (event) => {
        this.setState({ title: event.target.value });
    }

    handleKeyUp = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleSubmit();
        } else if (event.key === 'Escape' || event.keyCode === 27) {
            this.handleCancel();
        }
    }

    render() {
        let className = 'board-item';
        if (this.props.selected) {
            className += ' board-selected';
        }
    
        return (
            <div className={className} onClick={() => this.props.openBoard(this.props.boardId)}>
                {!this.state.edit && <div className="board-title">{this.props.title}</div>}
                {!this.state.edit && <div className="edit-board-btn" onClick={this.showEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#333333AA"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                </div>}
                {this.state.edit && <input autoFocus className="board-title-input" type="text" value={this.state.title} onChange={this.handleTextChange} onKeyUp={this.handleKeyUp} onBlur={this.handleCancel} />}
            </div>
        );
    }
}

export default BoardItem;
