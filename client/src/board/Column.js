import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';

export default class Column extends Component {
  render() {
    const title = this.props.title;
    const index = this.props.index;
    return (
      <Draggable draggableId={title} index={index}>
        {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.draggableProps}>
                {title}
            </div>
        )}
      </Draggable>
    );
  }
}