import React from 'react';
import ReactDOM from 'react-dom';
import Theme from '../theme';
import etherpadserver from './etherpadserver.json';
import { Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import socket from '../socket';
import chooseDice from './chooseDice.js';
import changePad from './changePad.js';
import showCharacterDialog from './characterDialog';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import CasinoIcon from '@material-ui/icons/Casino';
import CloseIcon from '@material-ui/icons/Close';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import NoteIcon from '@material-ui/icons/Note';

var hubInfo = null;
var myName = null;

function updateName(name) {
    myName = name;
}

function updateInfo(info) {
    let firstTime = hubInfo == null;
    hubInfo = info;

    if (firstTime) {
        ReactDOM.render(<Theme><Hub /></Theme>, document.getElementById('root'));
    } else {

    }
}

function openChangePad(index) {
    changePad(hubInfo, index);
}

const portraitSize = 130;

const useStyles = makeStyles({
    padContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '70vh',
    },

    pad: {
        flexGrow: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },

    padIframe: {
        border: 'none',
        width: '100%',
        height: '100%',
        borderRadius: 10,
        padding: 3
    },

    characterContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '30vh',
        justifyContent: 'space-evenly',
    },

    character: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        height: '100%',
        width: 140,
        border: '1px solid #ffffff2f',
        borderRadius: 10,
        '& > .portrait': {
            width: portraitSize,
            height: portraitSize,
            position: 'relative',
            '& > img': {
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: 8,
            },
            '& > .dice': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: portraitSize,
                height: portraitSize,
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
            },
            '& > button': {
                position: 'absolute',
                top: 0,
                right: 0,
            },
        },
        '& > .buttons': {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            width: '100%',
            height: 20,
        }
    },
});

function Pad(props) {
    const classes = useStyles();

    return (
        <div className={classes.pad} style={props.style}>
            <Typography style={{textAlign: 'center'}}>
                {hubInfo.openPads[props.index]}
                <IconButton onClick={() => openChangePad(props.index)}><FolderOpenIcon /></IconButton>
            </Typography>
            <iframe name="embed_readwrite" className={classes.padIframe} src={`${etherpadserver}/p/${hubInfo.openPads[props.index]}`}></iframe>
        </div>
    );
}

function Character(props) {
    const classes = useStyles();

    let isMe = props.name == myName;

    return (
        <div className={classes.character}>
            {props.name}
            <div className="portrait">
                <img src={props.portraits[props.portraitSelected]} />
                <div className="dice" title={props.dice.length > 0 ? `${props.dice.map(d => `${d[1] == '' ? '?' : d[1]}/${d[0]}`).join('\n')}\n\n${props.dice.reduce((a, b) => [0, a[1]+(b[1] === '' ? 0 : b[1])], [0, 0])[1]}/${props.dice.reduce((a, b) => [a[0]+b[0]], [0])[0]}` : null}>
                    {props.dice.map(d => <img width={portraitSize / (props.dice.length == 1 ? 1 : 2)} src={`/dice/d${d[0]}${d[1] == '' ? '' : '-'}${d[1]}.png`} />)}
                </div>
                {isMe ? (
                    props.dice.length == 0
                        ? <IconButton title="roll" onClick={chooseDice}><CasinoIcon fontSize="small" /></IconButton>
                        : <IconButton title="clear roll" onClick={() => socket.emit('roll', [])}><CloseIcon fontSize="small" /></IconButton>
                ) : null}
            </div>
            <div className="buttons">
                <IconButton title="character info" onClick={() => showCharacterDialog(props, isMe, 0)}><RecentActorsIcon fontSize="small" /></IconButton>
                <IconButton title="inventory" onClick={() => showCharacterDialog(props, isMe, 1)}><LocalMallIcon fontSize="small" /></IconButton>
                {isMe ? <IconButton title="personal notes" onClick={() => showCharacterDialog(props, isMe, 2)}><NoteIcon fontSize="small" /></IconButton> : null}
            </div>
        </div>
    );
}

function Hub() {
    const classes = useStyles();

    const [s, ss] = React.useState(0);
    const update = () => ss(Math.random());

    React.useEffect(() => {
        socket.on('info', update);
    }, []);

    return (
        <div>
            <div className={classes.padContainer}>
                <Pad index={0} />
                <Pad index={1} />
            </div>
            <div className={classes.characterContainer}>
                {hubInfo.online.map(name => hubInfo.characters.find(char => char.name === name)).map(char => <Character {...char} />)}
            </div>
        </div>
    );
}

export default {
    updateName, updateInfo, openChangePad
};