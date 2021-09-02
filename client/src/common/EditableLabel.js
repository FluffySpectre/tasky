import React from 'react';
import './EditableLabel.css';

class EditableLabel extends React.Component {
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

        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleSubmit();
        } else if (event.key === 'Escape' || event.keyCode === 27) {
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
        let className = 'editable-label';
        if (this.props.className) {
            className += ' ' + this.props.className;
        }

        return (
            <div className={className}>
                {this.state.edit && <input 
                    autoFocus
                    type="text" placeholder={this.props.placeholder}
                    value={this.state.text}
                    onChange={this.handleTextChange} onKeyUp={this.handleKeyUp}  />}
                {!this.state.edit && <div className="edit-label" onClick={this.handleEdit}>
                    <span>{this.state.text}</span>
                    </div>
                }
            </div>
        );
    }
}

export default EditableLabel;
