import React from 'react';
import './NewList.css';

class NewList extends React.Component {
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
            <div className="new-list">
                <textarea 
                    autoFocus
                    type="text" placeholder="Insert a title for this list..."
                    className="new-list-title" value={this.state.title}
                    onChange={this.handleTitleChange} onKeyUp={this.handleKeyUpTitle} />
                <div className="new-list-buttons">
                    <button className="primary-action-btn add" onClick={this.handleAdd}>Add list</button>
                    <div className="abort-creation" onClick={this.props.abort}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#333333AA"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewList;
