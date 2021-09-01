import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import './List.css';
import EditableLabel from '../common/EditableLabel';
import Card from './Card';
import NewCard from './NewCard';

export default class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newCard: false,
            newCardTitle: '',
        };
    }

    handleAddCard = (listId, title) => {
        this.props.addCard(listId, title);

        // reset the input form
        this.setState({
            newCardTitle: ''
        });
    }

    showNewCard = () => {
        this.setState({ newCard: true, newCardTitle: '' });
    }

    abortNewCard = () => {
        this.setState({ newCard: false, newCardTitle: '' });
    }

    render() {
        const l = this.props.list;

        const cards = l.cards.map((c, cIdx) =>
            <Card cardId={c.id} title={c.title} listId={l.id} cardIdx={cIdx} deleteCard={this.props.deleteCard} />
        );

        return (
            <div key={l.id} id={l.id} className="list">
                <div className="titlebar">
                    <EditableLabel text={l.title} placeholder="Add a title..." submit={(text) => this.props.updateListTitle(l.id, text)} />
                    <div className="delete-list" onClick={() => this.props.deleteList(l.id)}>X</div>
                    <div className="task-count"><span>{l.cards.length}</span></div>
                </div>

                <Droppable droppableId={l.id} direction="vertical">
                    {(provided, snapshot) => (
                        <div className={'cards' + (snapshot.isDraggingOver ? ' dragging-over' : '')} ref={provided.innerRef} {...provided.droppableProps}>
                            {cards}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                {this.state.newCard && <NewCard title={this.state.newCardTitle} add={(title) => this.handleAddCard(l.id, title)} abort={this.abortNewCard} />}

                {!this.state.newCard && <div className="add-card" onClick={this.showNewCard}>+ Add new card</div>}
            </div>
        );
    }
}