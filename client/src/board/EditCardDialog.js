import React from 'react';
import EditableLabel from '../common/EditableLabel';
import EditableTextarea from '../common/EditableTextarea';
import './EditCardDialog.css';

export default class EditCardDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: props.cardTitle || '',
            description: props.cardDescription || '',
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.cardTitle !== prevProps.cardTitle) {
          this.setState({ title: this.props.cardTitle });
        }
        if (this.props.cardDescription !== prevProps.cardDescription) {
            this.setState({ description: this.props.cardDescription });
        }
    }

    validTextInput(text) {
        const t = text.replace('\n', '');
        return t && t.length > 0;
    }

    setTitle = (title) => {
        if (!this.validTextInput(title)) return;
        this.setState({ title: title.trim() });
        this.props.editTitle(title.trim());
    }

    setDescription = (description) => {
        this.setState({ description: description.trim() });
        this.props.editDescription(description.trim());
    }

    render() {
        return (
            <div className="edit-card-dialog">
                <div className="backdrop" onClick={this.props.cancel}></div>
                <div className="dialog-container">
                    <div className="dialog-close" onClick={this.props.cancel}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#333333AA"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
                    </div>
                    <EditableLabel text={this.state.title} className="dialog-title" placeholder="Add a title..." submit={this.setTitle} />
                    <EditableTextarea text={this.state.description} className="dialog-description" placeholder="A description can be put here..." submit={this.setDescription} />
                    <div className="btn-container">
                        <button className="primary-action-btn edit-delete-btn" onClick={this.props.delete}>Delete card</button>
                    </div>
                </div>
            </div>
        );
    }
}
