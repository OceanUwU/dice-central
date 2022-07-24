import React from 'react';
import { Button, IconButton, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import showDialog from '../Dialog/show';
import socket from '../socket';
import Hub from './index.js';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ImageIcon from '@material-ui/icons/Image';

const useStyles = makeStyles({
    padBox: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 500,
    }
});

function PadCreator(props) {
    const [name, setName] = React.useState('');

    return (
        <div>
            <TextField label="Name" value={name} onChange={event => setName(event.target.value)} />
            <br />
            <Button onClick={() => {
                socket.emit('createPad', name, 0);
                creatorDialog.handleClose();
                showDialog({title: 'Creating...'});
                setTimeout(() => Hub.openChangePad(props.index), 1000);
            }}>Create Text File</Button>
            <Button onClick={() => {
                socket.emit('createPad', name, 1);
                creatorDialog.handleClose();
                showDialog({title: 'Creating...'});
                setTimeout(() => Hub.openChangePad(props.index), 1000);
            }}>Create Image File</Button>
        </div>
    );
}

let creatorDialog = null;

async function createPad(index) {
    creatorDialog = await showDialog({
        title: 'New Pad',
        layer: 'padcreator'
    }, <PadCreator index={index} />);
}

async function deletePad(pad, index) {
    let deleterDialog = await showDialog({
        title: 'Delete Pad',
        description: `Are you sure you want to delete the "${pad}" Pad?`,
        layer: 'padcreator',
        buttonText: 'Delete',
        buttonAction: () => {
            socket.emit('deletePad', pad);
            deleterDialog.handleClose();
            showDialog({title: 'Deleting...'});
            setTimeout(() => Hub.openChangePad(index), 1000);
        },
    });
}

function PadChanger(props) {
    const classes = useStyles();

    return (
        <div className={classes.padBox}>
            {props.hubInfo.pads.map(pad => (
                <div>
                    <Button disabled={props.hubInfo.openPads.includes(pad[0])} style={{textTransform: 'none'}} onClick={() => {
                        socket.emit('changePad', props.index, pad[0]);
                        changerDialog.handleClose();
                    }}>{pad[1] == 0 ? <ReceiptIcon /> : <ImageIcon />}{pad[0]}</Button>
                    {pad[0] != 'Notes' ?  <IconButton onClick={() => deletePad(pad[0], props.index)}><DeleteIcon /></IconButton> : null}
                </div>
            ))}
            <IconButton onClick={() => createPad(props.index)}><AddIcon /></IconButton>
        </div>
    );
}

let changerDialog = null;

async function changePad(hubInfo, index) {
    changerDialog = await showDialog({
        title: 'Choose Pad',
    }, <PadChanger hubInfo={hubInfo} index={index} />);
}

export default changePad;