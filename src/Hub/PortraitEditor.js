import React from 'react';
import { Button, IconButton, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import showDialog from '../Dialog/show';
import socket from '../socket';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
    portrait: {
        width: 100,
        height: 100,
        objectFit: 'contain'
    }
}));

function PortraitAdder(props) {
    const [url, setUrl] = React.useState('');

    return (
        <div>
            <TextField label="Image URL" value={url} onChange={event => setUrl(event.target.value)} />
            <br />
            <Button onClick={() => {
                socket.emit('addPortrait', url);
                adderDialog.handleClose();
            }}>Add</Button>
        </div>
    );
}

let adderDialog;

async function addPortrait() {
    adderDialog = await showDialog({
        title: 'Add Portrait'
    }, <PortraitAdder />);
}

function PortraitEditor(props) {
    const classes = useStyles();

    const [portraits, setPortraits] = React.useState(props.portraits);
    const [selected, setSelected] = React.useState(props.portraitSelected);

    return (
        <div>
            <div>
                {props.portraits.map((url, index) => (
                    <Button onClick={() => {
                        socket.emit('changePortrait', index);
                        setSelected(index);
                    }} disabled={selected == index}><img style={{opacity: selected == index ? 0.2 : 1}} className={classes.portrait} src={url} /></Button>
                ))}
            </div>
            <IconButton onClick={addPortrait}><AddIcon /></IconButton>
        </div>
    );
}

export default PortraitEditor;