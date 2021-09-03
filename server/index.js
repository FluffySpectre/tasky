const express = require('express');
const app = express();
const socket = require('socket.io');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');

// override console log to add time 
const origConsoleLog = console.log;
console.log = (...args) => {
    const d = new Date();
    const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    const seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
    const dString = '[' + hours + ':' + minutes + ':' + seconds + ']';
    origConsoleLog(dString, ...args);
};

app.use(express());

const port = 3001;

app.use(cors());
app.use(express.static('public'));

var server = app.listen(
  port,
  console.log(`Server is running on the port no: ${(port)} `)
);

const io = socket(server);

// UTILS
const getId = () => crypto.randomBytes(3).toString('hex');

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}; 

// moves an item from one list to another list
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

// LOGIN
function loginUser(client, username) {
    const userInfo = users.find(u => u.client.id === client.id);
    userInfo.username = username;
}

// DATA

function getBoardsOfUser(username) {
    return Object.values(boards).filter(b => b.creator === username)
                                .sort((a, b) => b.createDate - a.createDate);
}

function createTask(boardId, listId, title) {
    boards[boardId].lists = boards[boardId].lists.map(l => {
        if (l.id === listId) {
            l.cards.push({ id: getId(), title });
        }
        return l;
    });

    saveBoardToJSON(boards[boardId]);
}

function editTask(boardId, listId, taskId, title, description) {
    boards[boardId].lists = boards[boardId].lists.map(l => {
        if (l.id === listId) {
            const task = l.cards.find(c => c.id === taskId);

            if (title !== null) {
                task.title = title;
            }

            if (description !== null) {
                task.description = description;
            }
        }
        return l;
    });

    saveBoardToJSON(boards[boardId]);
}

function deleteTask(boardId, listId, taskId) {
    boards[boardId].lists = boards[boardId].lists.map(l => {
        if (l.id === listId) {
            const taskIdx = l.cards.findIndex(c => c.id === taskId);
            l.cards.splice(taskIdx, 1);
        }
        return l;
    });

    saveBoardToJSON(boards[boardId]);
}

function moveTask(boardId, sourceListId, destinationListId, sourceTaskIndex, destinationTaskIndex) {
    const board = boards[boardId];

    const sourceList = {...board.lists.find(l => l.id === sourceListId) };
    const destList = {...board.lists.find(l => l.id === destinationListId) };
    const destListIndex = board.lists.findIndex(l => l.id === destinationListId);

    // if the drop is on the same list, just reorder the list
    if (sourceListId === destinationListId) {
        const newCards = reorder(
            destList.cards,
            sourceTaskIndex,
            destinationTaskIndex,
        );
        const newLists = [...board.lists];
        newLists[destListIndex].cards = newCards;

        boards[boardId].lists = newLists;

        console.log('Dropped in same list, reordered');

    // the drop is on another list, move the dropped item
    // to the destination
    } else {
        const sourceParam = { index: sourceTaskIndex, droppableId: sourceListId };
        const destinationParam = { index: destinationTaskIndex, droppableId: destinationListId };
        const newCards = move(sourceList.cards, destList.cards, sourceParam, destinationParam);
        const newLists = [...board.lists];
        const listIds = Object.keys(newCards);

        for (let id of listIds) {
            const currList = newLists.filter(l => l.id === id)[0];
            currList.cards = newCards[id];
        }

        boards[boardId].lists = newLists;

        console.log('Dropped in another list, moved');
    }

    saveBoardToJSON(boards[boardId]);
}

function createList(boardId, title) {
    boards[boardId].lists.push({ id: getId(), title, cards: [] });

    saveBoardToJSON(boards[boardId]);
}

function deleteList(boardId, listId) {
    boards[boardId].lists = boards[boardId].lists.filter(l => l.id !== listId);

    saveBoardToJSON(boards[boardId]);
}

function updateListTitle(boardId, listId, title) {
    const listToUpdate = boards[boardId].lists.find(l => l.id === listId);
    listToUpdate.title = title;

    saveBoardToJSON(boards[boardId]);
}

function deleteBoard(boardId) {
    delete boards[boardId];
    deleteBoardJSON(boardId);
}

function saveBoardToJSON(boardData) {
    const jsonData = JSON.stringify(boardData, null, 2);
    const filepath = './boards/' + boardData.id + '.json';
    fs.writeFile(filepath, jsonData, (err) => {
        if (err) console.error('FILE ERROR');
    });
}

function loadBoardsFromJSON() {
    const jsonFiles = fs.readdirSync('./boards').filter(f => f.endsWith('.json'));

    let loadedBoards = {};
    for (let f of jsonFiles) {
        const fileContent = fs.readFileSync('./boards/' + f);
        const boardData = JSON.parse(fileContent);
        loadedBoards[boardData.id] = boardData;
    }

    return loadedBoards;
}

function deleteBoardJSON(boardId) {
    const filepath = './boards/' + boardId + '.json';
    fs.rm(filepath, (err) => {
        if (err) console.error('FILE RM ERROR');
    });
}

function getUserByClient(client) {
    return users.find(u => u.client.id === client.id);
}

let users = [];
let boards = loadBoardsFromJSON();

console.log('Loaded ' + Object.keys(boards).length + ' boards');

io.on('connection', client => {
    console.log('Connected: ' + client.id + '(IP: ' + client.request.connection.remoteAddress + ')');

    // register user
    users.push({ client, currentBoardId: null });

    client.on('disconnect', (reason) => {
        console.log('Disconnected: ' + client.id);

        // unregister the user
        users = users.filter(u => u.client.id !== client.id);
    });

    client.on('login', (data) => {
        const username = data.username;

        loginUser(client, username);

        console.log('login as ' + username);
    });

    client.on('board-list', (data) => {
        const user = getUserByClient(client);
        const boardsOfUser = getBoardsOfUser(user.username);

        client.emit('board-list', boardsOfUser);

        console.log('requested board list');
    });

    client.on('create-board', (data) => {
        const boardTitle = data.title;

        const user = getUserByClient(client);

        const boardId = getId();
        const boardInfo = { id: boardId, creator: user.username, createDate: Date.now(), title: boardTitle, lists: [] };
        boards[boardId] = boardInfo;

        saveBoardToJSON(boards[boardId]);

        const boardsOfUser = getBoardsOfUser(user.username);
        client.emit('board-list', boardsOfUser);

        console.log('board created', boardInfo);
    });

    client.on('update-board', (data) => {
        const boardId = data.boardId;
        const boardTitle = data.title;

        const user = getUserByClient(client);

        boards[boardId].title = boardTitle;

        saveBoardToJSON(boards[boardId]);

        const boardsOfUser = getBoardsOfUser(user.username);
        client.emit('board-list', boardsOfUser);

        console.log('board updated', boardId, boardTitle);
    });

    client.on('delete-board', (data) => {
        const boardId = data.boardId;

        const user = getUserByClient(client);

        deleteBoard(boardId);

        const boardsOfUser = getBoardsOfUser(user.username);
        client.emit('board-list', boardsOfUser);

        console.log('board deleted', boardId);
    });

    client.on('board', (data) => {
        console.log('Board requested. Return data of board with the given id or create a new one.', data);

        // if a id is given, check if a JSON-file for it exists
        // if so, read that file and send the data to the client

        // if there is no id, or its exists no JSON-file create a new board
        // and send that instead

        if (boards.hasOwnProperty(data.id)) {
            const boardInfo = boards[data.id];

            // assign user to board
            const user = getUserByClient(client);
            if (user) {
                // leave the channel of the current board first
                if (user.currentBoardId !== null) {
                    client.leave('board:' + user.currentBoardId);
                }

                user.currentBoardId = boardInfo.id;

                console.log('User assigned to board', boardInfo.id);
            }
            client.join('board:' + boardInfo.id);

            io.to('board:' + boardInfo.id).emit('board-update', boardInfo);
        }
    });

    client.on('leave-board', () => {
        const user = users.find(u => u.client.id === client.id);
        if (user && user.currentBoardId) {
            client.leave('board:' + user.currentBoardId);
            user.currentBoardId = null;

            console.log('user left board');
        }
    });

    client.on('create-task', (data) => {
        const boardId = data.boardId;
        const title = data.title;
        const listId = data.listId;

        createTask(boardId, listId, title);

        // send update
        io.to('board:' + boardId).emit('board-update', boards[boardId]);

        console.log('create task', boardId, title, listId);
    });

    client.on('edit-task', (data) => {
        const boardId = data.boardId;
        const listId = data.listId;
        const taskId = data.cardId;
        const title = data.title;
        const description = data.description;

        editTask(boardId, listId, taskId, title, description);

        // send update
        io.to('board:' + boardId).emit('board-update', boards[boardId]);

        console.log('edit task', boardId, taskId, listId, title);
    });

    client.on('delete-task', (data) => {
        const boardId = data.boardId;
        const listId = data.listId;
        const taskId = data.cardId;

        deleteTask(boardId, listId, taskId);

        // send update
        io.to('board:' + boardId).emit('board-update', boards[boardId]);

        console.log('delete task', boardId, taskId, listId);
    });

    client.on('move-task', (data) => {
        const boardId = data.boardId;
        const sourceListId = data.sourceListId;
        const destinationListId = data.destinationListId;
        const sourceTaskIndex = data.sourceTaskIndex;
        const destinationTaskIndex = data.destinationTaskIndex;

        moveTask(boardId, sourceListId, destinationListId, sourceTaskIndex, destinationTaskIndex);

        // send update
        io.to('board:' + boardId).emit('board-update', boards[boardId]);

        console.log('move task', boardId, sourceListId, destinationListId, sourceTaskIndex, destinationTaskIndex);
    });

    client.on('create-list', (data) => {
        const boardId = data.boardId;
        const title = data.title;

        createList(boardId, title);

        // send update
        io.to('board:' + boardId).emit('board-update', boards[boardId]);

        console.log('create list', boardId, title);
    });

    client.on('delete-list', (data) => {
        const boardId = data.boardId;
        const listId = data.listId;

        deleteList(boardId, listId);

        // send update
        io.to('board:' + boardId).emit('board-update', boards[boardId]);

        console.log('delete list', boardId, listId);
    });

    client.on('update-list-title', (data) => {
        const boardId = data.boardId;
        const listId = data.listId;
        const title = data.title;

        updateListTitle(boardId, listId, title);

        // send update
        io.to('board:' + boardId).emit('board-update', boards[boardId]);

        console.log('update list title', boardId, listId, title);
    });
});

