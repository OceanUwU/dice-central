import React from 'react';
import ReactDOM from 'react-dom';
import Theme from '../theme';
import socketIOClient from 'socket.io-client';
import showDialog from '../Dialog/show';
import Connecting from './Connect/ing';
import ConnectFailed from './Connect/Failed';
import CharSelect from '../CharSelect';
import Hub from '../Hub';

var socket = socketIOClient('', {
    transports: ['websocket'],
});

ReactDOM.render(<Theme><Connecting /></Theme>, document.getElementById('root'));

var connectedYet = false;
socket.on('chars', characters => {
    if (!connectedYet) {
        connectedYet = true;
        ReactDOM.render(<Theme><CharSelect characters={characters} /></Theme>, document.getElementById('root'));
    } else
        window.location.reload(false)
});

function displayConnectionFail(error) {
    setTimeout(() => {
        if (socket.disconnected) {
            ReactDOM.render(<Theme><ConnectFailed error={error.toString()} /></Theme>, document.getElementById('root'));
            socket.disconnect();
        }
    }, 10000);
}

socket.on('connect_error', displayConnectionFail);
socket.on('connect_timeout', displayConnectionFail);
socket.on('disconnect', displayConnectionFail);

socket.on('refresh', () => window.location.reload(false));
socket.on('err', (error='Unknown error', title='Error:') => {
    showDialog({
        layer: 'err',
        title: title,
        description: error,
    });
});

socket.on('name', Hub.updateName);
socket.on('info', Hub.updateInfo);

export default socket;