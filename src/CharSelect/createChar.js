import React from 'react';
import { TextField, Button } from '@material-ui/core';
import showDialog from '../Dialog/show';
import socket from '../socket';

function CharacterCreator() {
    const [name, setName] = React.useState('');
    const [owner, setOwner] = React.useState('');
    //const handleChangeName = event => setName(event.target.value);
    //const handleChangeOwner = event => setOwner(event.target.value);

    return (
        <div>
            <TextField label="Name" value={name} onChange={event => setName(event.target.value)} />
            <br />
            <TextField label="Owner" value={owner} onChange={event => setOwner(event.target.value)} />
            <br />
            <Button onClick={() => socket.emit('createChar', name, owner)}>Create</Button>
        </div>
    );
}

function createChar() {
    showDialog({
        title: 'New character',
    }, <CharacterCreator />);
}

export default createChar;