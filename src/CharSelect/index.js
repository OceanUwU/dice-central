import React from 'react';
import { Typography, Button, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import socket from '../socket';
import createChar from './createChar.js';
import editChar from './editChar.js';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles({
    charContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        padding: 10,
    },

    charButton: {
        border: '1px solid black',
        textTransform: 'none',
    },

    char: {
        display: 'flex',
        flexDirection: 'column',
    },

    img: {
        width: 200,
        height: 200,
        objectFit: 'contain'
    }
});

function CharSelect(props) {
    const classes = useStyles();

    return (
        <div>
            <Typography variant="h2" style={{textAlign: 'center'}}>Choose your character</Typography>

            <div className={classes.charContainer}>
                {props.characters.map(char => (
                    <div>
                        <Button className={classes.charButton} onClick={() => socket.emit('chooseChar', char.name)}>
                            <div className={classes.char}>
                                <Typography variant="h5">{char.name}</Typography>
                                <Typography>{char.owner}</Typography>
                                <img src={char.portraits[char.portraitSelected]} className={classes.img} />
                            </div>
                        </Button>
                        <IconButton onClick={() => editChar(char)}><EditIcon /></IconButton>
                    </div>
                ))}

                <Button className={classes.charButton} onClick={createChar}>
                    <div className={classes.char}>
                        <Typography variant="h5">New</Typography>
                        <AddCircleOutlineIcon style={{width: 200, height: 200}} />
                    </div>
                </Button>
            </div>
        </div>
    );
}

export default CharSelect;