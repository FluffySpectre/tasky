import React from 'react';
import EditableLabel from '../common/EditableLabel';
import './EditCardDialog.css';

export default class EditCardDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.cardTitle,
      description: props.cardDescription,
    };
  }

  handleDescriptionChange = (event) => {
    this.setState({ description: event.target.value });
  }

  handleSubmit = () => {
    this.props.edit(this.state.title.trim(), this.state.description.trim());
  }

  render() {
    return (
      <div className="edit-card-dialog">
        <div className="backdrop"></div>
        <div className="dialog-container">
          <div className="dialog-close" onClick={this.props.cancel}><span>X</span></div>
          <EditableLabel text={this.state.title} className="dialog-title" placeholder="Add a title..." submit={(text) => this.setState({ title: text })} />
          <textarea className="dialog-description-input" value={this.state.description} placeholder="A description can be put here..." onChange={this.handleDescriptionChange}></textarea>
          <div className="btn-container">
            <button className="primary-action-btn edit-save-btn" onClick={this.handleSubmit}>Save</button>
            <button className="primary-action-btn edit-delete-btn" onClick={this.props.delete}>Delete card</button>
          </div>
        </div>
      </div>
    );
  }
}
