import { render, screen } from '@testing-library/react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
import Card from './Card';

configure({ adapter: new Adapter() });

jest.mock('react-beautiful-dnd', () => ({
    Droppable: ({ children }) => children({
        draggableProps: {
            style: {},
        },
        innerRef: jest.fn(),
    }, {}),
    Draggable: ({ children }) => children({
        draggableProps: {
            style: {},
        },
        innerRef: jest.fn(),
    }, {}),
    DragDropContext: ({ children }) => children,
}));

test('renders card with title only', () => {
    const { container } = render(
        <Card cardId="a0a0a0" cardIdx="1" title="Hello World!" description="" />
    );
    const titleElement = screen.getByText(/hello world!/i);
    expect(titleElement).toBeInTheDocument();

    expect(container.getElementsByClassName('notes-icon').length).toBe(0);
});

test('renders card with title and description indicator', () => {
    const { container } = render(
        <Card cardId="a0a0a0" cardIdx="1" title="Hello World!" description="My Description" />
    );
    const titleElement = screen.getByText(/hello world!/i);
    expect(titleElement).toBeInTheDocument();

    expect(container.getElementsByClassName('notes-icon').length).toBe(1);
});

test('editCard function gets called', () => {
    const editFunc = jest.fn();

    const card = shallow((
        <Card cardId="a0a0a0" cardIdx="1" listId="b0b0b0" title="Hello World!" description="My Description" editCard={editFunc} />
    ));

    card.dive().find('.edit-card').simulate('click');

    // listId, cardId, title, description
    expect(editFunc).toHaveBeenCalledWith('b0b0b0', 'a0a0a0', 'Hello World!', 'My Description');
});
