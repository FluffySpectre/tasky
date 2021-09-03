import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import './Board.css';
import NewList from './NewList';
import { move, reorder } from './reorder';
import List from './List';
import EditCardDialog from './EditCardDialog';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boardId: props.id || null,
            lists: [],
            newList: false,
            newListTitle: '',
            editCard: false,
            editCardId: null,
            editCardListId: null,
            editCardTitle: '',
            editCardDescription: '',
        };
    }

    componentDidMount() {
        this.setState({
            boardId: this.props.id || null,
            lists: [],
            newList: false,
            newListTitle: '',
        }
        );

        // subscribe for board updates
        this.props.socket.on('board-update', this.socketBoardUpdate);
        // request the selected board or create a new one
        this.props.socket.emit('board', { id: this.props.id });
    }

    componentDidUpdate(prevProps) {
        // reset the board if the board id changes
        if (this.props.id !== prevProps.id) {
            this.setState({ 
                boardId: this.props.id,
                lists: [],
                newList: false,
                newListTitle: ''
            });

            if (this.props.id) {
                // request the selected board or create a new one
                this.props.socket.emit('board', { id: this.props.id });
            }
        }
    }

    componentWillUnmount() {
        this.props.socket.emit('leave-board');
        this.props.socket.off('board-update', this.socketBoardUpdate);
    }

    socketBoardUpdate = (data) => {
        this.setState({ boardId: data.id, lists: data.lists });
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

    updateListTitle = (listId, title) => {
        this.props.socket.emit('update-list-title', { boardId: this.state.boardId, listId, title });
    }

    // CARDS

    handleShowEdit = (listId, cardId, title, description) => {
        this.setState({ editCard: true, editCardId: cardId, editCardListId: listId, editCardTitle: title, editCardDescription: description });
    }

    handleEditTitle = (title) => {
        this.editCard(this.state.editCardListId, this.state.editCardId, title, null);
    }

    handleEditDescription = (description) => {
        this.editCard(this.state.editCardListId, this.state.editCardId, null, description);
    }

    handleDelete = () => {
        this.deleteCard(this.state.editCardListId, this.state.editCardId);
        this.setState({ editCard: false, editCardId: null, editCardListId: null });
    }

    handleCancelEdit = () => {
        this.setState({ editCard: false, editCardId: null, editCardListId: null });
    }

    addCard = (listId, title) => {
        this.props.socket.emit('create-task', { boardId: this.state.boardId, title, listId });
    }

    editCard = (listId, cardId, title, description) => {
        this.props.socket.emit('edit-task', { boardId: this.state.boardId, cardId, title, description, listId });
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
            return (
                <List
                    key={idx}
                    list={l}
                    addCard={this.addCard}
                    editCard={this.handleShowEdit}
                    updateListTitle={this.updateListTitle}
                    deleteList={this.deleteList}
                />
            );
        });

        return (
            <div className="grid">
                <DragDropContext onDragStart={this.dragStart} onDragEnd={this.dragEnd}>
                    {listItems}
                </DragDropContext>

                {!this.state.newList && <div className="add-list" onClick={this.showNewList}><span>+ Add a new list</span></div>}
                {this.state.newList && <NewList title={this.state.newListTitle} add={(title) => this.handleAddList(title)} abort={this.abortNewList} />}

                {this.state.editCard && <EditCardDialog 
                    cardId={this.state.editCardId}
                    listId={this.state.editCardListId}
                    cardTitle={this.state.editCardTitle}
                    cardDescription={this.state.editCardDescription}
                    editTitle={this.handleEditTitle}
                    editDescription={this.handleEditDescription}
                    delete={this.handleDelete}
                    cancel={this.handleCancelEdit} />
                }
            </div>
        );
    }
}

export default Board;