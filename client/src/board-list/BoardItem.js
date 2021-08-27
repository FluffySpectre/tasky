import React from 'react';
import './BoardItem.css';

function BoardItem(props) {
    let className = 'board-item';
    if (props.selected) {
        className += ' board-selected';
    }

    return (
        <div className={className} onClick={() => props.openBoard(props.boardId)}>
            <div className="board-title">{props.title}</div>
        </div>
    );
}

export default BoardItem;
