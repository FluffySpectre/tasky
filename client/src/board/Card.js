import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './Card.css';

function Card(props) {
    return (
        <Draggable key={props.cardId} draggableId={props.cardId} index={props.cardIdx} type="card">
             {(provided, snapshot) => (
                <div className="card" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <div className="card-title">{props.title}</div>
                    <div className="delete-card" onClick={() => props.deleteCard(props.listId, props.cardId)}>X</div>
                </div>
            )}
        </Draggable>
    );
}

export default Card;
