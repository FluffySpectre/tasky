import React from 'react';
import EditableLabel from '../common/EditableLabel';
import './EditCardDialog.css';

export default class EditCardDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.cardTitle || '',
      description: props.cardDescription || '',
    };
  }

  handleDescriptionChange = (event) => {
    this.setState({ description: event.target.value });
  }

  handleSubmit = () => {
    if (!this.validTitle()) return;
    this.props.edit(this.state.title.trim(), this.state.description.trim());
  }

  validTitle() {
    const t = this.state.title.replace('\n', '');
    return t && t.length > 0;
}

  render() {
    return (
      <div className="edit-card-dialog">
        <div className="backdrop"></div>
        <div className="dialog-container">
          <div className="dialog-close" onClick={this.props.cancel}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#333333AA"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </div>
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
