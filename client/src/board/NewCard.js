import React from 'react';
import './NewCard.css';

class NewCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            title: '',
        };
    }

    handleTitleChange = (event) => {
        this.setState({ title: event.target.value });
    }

    handleKeyUpTitle = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleAddCard();
        }
    }

    handleAddCard = () => {
        this.props.add(this.state.title);
        this.setState({ title: '' });
    }

    render() {
        return (
            <div className="new-card">
                <textarea 
                    autoFocus
                    type="text" placeholder="Insert a title for this card..."
                    className="new-card-title" value={this.state.title}
                    onChange={this.handleTitleChange} onKeyUp={this.handleKeyUpTitle} />
                <div className="new-card-buttons">
                    <button className="primary-action-btn add" onClick={this.handleAddCard}>Add card</button>
                    <div className="abort-creation" onClick={this.props.abort}><span>X</span></div>
                </div>
            </div>
        );
    }
}

export default NewCard;
