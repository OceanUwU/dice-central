import React from 'react';
import { TextField, Button } from '@material-ui/core';
import showDialog from '../Dialog/show';
import socket from '../socket';

function CharacterEditor(props) {
    const [name, setName] = React.useState(props.name);
    const [owner, setOwner] = React.useState(props.owner);
    //const handleChangeName = event => setName(event.target.value);
    //const handleChangeOwner = event => setOwner(event.target.value);

    return (
        <div>
            <TextField label="Name" value={name} onChange={event => setName(event.target.value)} />
            <br />
            <TextField label="Owner" value={owner} onChange={event => setOwner(event.target.value)} />
            <br />
            <Button onClick={() => socket.emit('renameChar', props.name, name, owner)}>Apply</Button>
        </div>
    );
}

function editChar(char) {
    showDialog({
        title: 'Edit character',
    }, <CharacterEditor {...char} />);
}

export default editChar;