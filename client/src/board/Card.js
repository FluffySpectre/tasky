import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './Card.css';

function Card(props) {
    return (
        <Draggable key={props.cardId} draggableId={props.cardId} index={props.cardIdx} type="card">
             {(provided, snapshot) => (
                <div className="card" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <div className="card-title">
                        {props.title}
                        {props.description && <div className="notes-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#333333AA"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"/></svg>
                        </div>}
                    </div>
                    <div className="edit-card" onClick={() => props.editCard(props.listId, props.cardId, props.title, props.description)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#333333AA"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                    </div>
                </div>
            )}
        </Draggable>
    );
}

export default Card;
