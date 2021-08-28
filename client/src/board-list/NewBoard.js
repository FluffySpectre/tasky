import React from 'react';
import './NewBoard.css';

class NewBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            title: '',
        };
    }

    handleTitleChange = (event) => {
        this.setState({ title: event.target.value.replace('\n', '') });
    }

    handleKeyUpTitle = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleAdd();
        }
    }

    handleAdd = () => {
        if (!this.validTitle()) return;

        this.props.add(this.state.title.trim());
        this.setState({ title: '' });
    }

    validTitle() {
        const t = this.state.title.replace('\n', '');
        return t && t.length > 0;
    }

    render() {
        return (
            <div className="new-board">
                <textarea 
                    autoFocus
                    type="text" placeholder="Insert a title for this board..."
                    className="new-board-title" value={this.state.title}
                    onChange={this.handleTitleChange} onKeyUp={this.handleKeyUpTitle} />
                <div className="new-board-buttons">
                    <button className="primary-action-btn add" onClick={this.handleAdd}>Create board</button>
                    <div className="abort-creation" onClick={this.props.abort}><span>X</span></div>
                </div>
            </div>
        );
    }
}

export default NewBoard;
