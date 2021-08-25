import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import './Board.css';
import Card from './Card';
import NewCard from './NewCard';
import NewList from './NewList';
import { move, reorder } from './reorder';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boardId: props.id || null,
            lists: [],
            newCardListId: null,
            newCardTitle: '',
            newList: false,
            newListTitle: '',
        };
    }

    componentDidMount() {
        this.setState({
            boardId: this.props.id || null,
            lists: [],
            newCardListId: null,
            newCardTitle: '',
            newList: false,
            newListTitle: '',
        }
        );

        // subscribe for board updates
        this.props.socket.on('board-update', (data) => {
            console.log('got new board infos:', data);

            this.setState({ boardId: data.id, lists: data.lists });
        });
        // request the selected board or create a new one
        this.props.socket.emit('board', { id: this.props.id });
    }

    componentWillUnmount() {
        this.props.socket.emit('leave-board');
    }

    // LISTS
    showNewList = () => {
        this.setState({ newList: true, newListTitle: '' });
    }

    abortNewList = () => {
        this.setState({ newList: false, newListTitle: '' });
    }

    handleAddList = (title) => {
        this.addList(title);

        // reset the input form
        this.setState({
            newListTitle: ''
        });
    }

    addList(title) {
        this.props.socket.emit('create-list', { boardId: this.state.boardId, title });
    }

    deleteList = (listId) => {
        this.props.socket.emit('delete-list', { boardId: this.state.boardId, listId });
    }

    // CARDS

    showNewCard(listId) {
        this.setState({ newCardListId: listId, newCardTitle: '' });
    }

    abortNewCard = () => {
        this.setState({ newCardListId: null, newCardTitle: '' });
    }

    handleAddCard = (listId, title) => {
        this.addCard(listId, title);

        // reset the input form
        this.setState({
            newCardTitle: ''
        });
    }

    addCard(listId, title) {
        this.props.socket.emit('create-task', { boardId: this.state.boardId, title, listId });
    }

    deleteCard = (listId, cardId) => {
        this.props.socket.emit('delete-task', { boardId: this.state.boardId, cardId, listId });
    }

    // DRAG N DROP
    dragStart = () => {
        console.log('Drag start');
    }

    dragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            console.log('Dropped outside of list');
            return;
        }

        if (result.destination.droppableId === result.source.droppableId
            && result.destination.index === result.source.index) {
            console.log('No change');
            return;
        }

        const sourceList = { ...this.state.lists.find(l => l.id === result.source.droppableId) };
        const destList = { ...this.state.lists.find(l => l.id === result.destination.droppableId) };
        const destListIndex = this.state.lists.findIndex(l => l.id === result.destination.droppableId);

        // if the drop is on the same list, just reorder the list
        if (result.source.droppableId === result.destination.droppableId) {
            const newCards = reorder(
                destList.cards,
                result.source.index,
                result.destination.index,
            );
            const newLists = [...this.state.lists];
            newLists[destListIndex].cards = newCards;

            this.setState({ lists: newLists });

            // the drop is on another list, move the dropped item
            // to the destination
        } else {
            const newCards = move(sourceList.cards, destList.cards, result.source, result.destination);
            const newLists = [...this.state.lists];
            const listIds = Object.keys(newCards);

            for (let id of listIds) {
                const currList = newLists.filter(l => l.id === id)[0];
                currList.cards = newCards[id];
            }

            this.setState({ lists: newLists });
        }

        // sourceListId, destinationListId, sourceTaskIndex, destinationTaskIndex
        this.props.socket.emit('move-task', {
            boardId: this.state.boardId,
            sourceListId: result.source.droppableId,
            destinationListId: result.destination.droppableId,
            sourceTaskIndex: result.source.index,
            destinationTaskIndex: result.destination.index
        });
    }

    render() {
        const listItems = this.state.lists.map((l, idx) => {
            const cards = l.cards.map((c, cIdx) =>
                <Card cardId={c.id} title={c.title} listId={l.id} cardIdx={cIdx} deleteCard={this.deleteCard} />
            );

            return (
                <div key={l.id} id={l.id} className="list">
                    <div className="titlebar">
                        <div className="title">{l.title + ' (' + l.cards.length + ')'}</div>
                        <div className="delete-list" onClick={() => this.deleteList(l.id)}>X</div>
                    </div>

                    <Droppable droppableId={l.id} direction="vertical">
                        {(provided, snapshot) => (
                            <div className={'cards' + (snapshot.isDraggingOver ? ' dragging-over' : '')} ref={provided.innerRef} {...provided.droppableProps}>
                                {cards}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    {this.state.newCardListId === l.id && <NewCard title={this.state.newCardTitle} add={(title) => this.handleAddCard(l.id, title)} abort={this.abortNewCard} />}

                    {this.state.newCardListId !== l.id && <div className="add-card" onClick={() => this.showNewCard(l.id)}>+ Add new card</div>}
                </div>
            );
        });

        return (
            <div className="grid">
                <DragDropContext onDragStart={this.dragStart} onDragEnd={this.dragEnd}>
                    {listItems}
                </DragDropContext>

                {!this.state.newList && <div className="add-list" onClick={this.showNewList}><span>+ Add a new list</span></div>}
                {this.state.newList && <NewList title={this.state.newListTitle} add={(title) => this.handleAddList(title)} abort={this.abortNewList} />}
            </div>
        );
    }
}

export default Board;