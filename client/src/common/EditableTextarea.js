import React from 'react';
import './EditableTextarea.css';

class EditableTextarea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
            edit: false
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.text !== prevProps.text) {
            this.setState({ text: this.props.text });
        }
    }

    handleEdit = () => {
        this.setState({ edit: true });
    };

    handleTextChange = (event) => {
        this.setState({ text: event.target.value });
    }

    handleKeyUp = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.key === 'Escape' || event.keyCode === 27) {
            this.handleCancel();
        }
    }

    handleSubmit = () => {
        // submit only, if the text changed
        if (this.props.text !== this.state.text) {
            this.props.submit(this.state.text);
        }
        this.setState({ edit: false });
    }

    handleCancel = () => {
        this.setState({ edit: false });
    }

    render() {
        let className = 'editable-textarea';
        if (this.props.className) {
            className += ' ' + this.props.className;
        }

        return (
            <div className={className}>
                {this.state.edit && <textarea
                    className="editable-textarea-edit-textarea"
                    autoFocus
                    placeholder={this.props.placeholder}
                    value={this.state.text}
                    onChange={this.handleTextChange} onKeyUp={this.handleKeyUp} onBlur={this.handleSubmit} />}
                {this.state.edit && <div className="editable-textarea-buttons">
                    <button className="primary-action-btn save" onClick={this.handleSubmit}>Save</button>
                    <div className="abort-creation" onClick={this.handleCancel}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#333333AA"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
                    </div>
                </div>}
                {!this.state.edit && <div className="editable-textarea-edit-label" onClick={this.handleEdit}>
                    {this.state.text && this.state.text.length > 0 && <span className="textarea-text">{this.state.text}</span>}
                    {(!this.state.text || this.state.text.length === 0) && <span className="textarea-text-placeholder">{this.props.placeholder}</span>}
                </div>
                }
            </div>
        );
    }
}

export default EditableTextarea;
