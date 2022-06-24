import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import showDialog from '../Dialog/show';
import socket from '../socket';

const diceTypes = [2, 4, 6, 8, 10, 12, 20];
var dice;
try {
    dice = JSON.parse(localStorage.diceSettings);
} catch (e) {
    dice = [];
}
if (!Array.isArray(dice))
    dice = [];

const useStyles = makeStyles({
    dicePool: {
        background: '#0000000f',
        borderRadius: 5,
    }
});

function DiceChooser() {
    const classes = useStyles();

    const [diceState, setDiceState] = React.useState(dice);
    const setDice = newDice => {
        dice = newDice;
        localStorage.diceSettings = JSON.stringify(newDice);
        setDiceState(newDice);
    }

    return (
        <div>
            <Typography>Add dice to the roll:</Typography>
            <div className={classes.dicePool}>
                {diceTypes.map(n => (
                    <Button onClick={() => {
                        if (diceState.length < 4)
                            setDice([...diceState, [n, n]])
                    }}><img src={`/dice/d${n}-${n}.png`} /></Button>
                ))}
            </div>
            
            <br /><Divider /><br />

            <Typography>Current roll (click to remove):</Typography>
            <div className={classes.dicePool}>
                {diceState.map((d, index) => (
                    <Button onClick={() => setDice([...diceState.slice(0,index), ...diceState.slice(index+1)])}><img src={`/dice/d${d[0]}${d[1] == '' ? '' : '-'}${d[1]}.png`} /></Button>
                ))}
            </div>

            <Button onClick={() => {
                setDice(diceState.map(d => [d[0], '']));
                setTimeout(() => setDice(diceState.map(d => [d[0], Math.ceil(Math.random() * d[0])])), 2000);
            }}>Private roll</Button>
        </div>
    );
}

async function chooseDice() {
    let dialog = await showDialog({
        title: 'Roll dice',
        buttonText: 'Roll',
        buttonAction: () => {
            dialog.handleClose();
            if (dice.length > 0)
                socket.emit('roll', dice.map(d => d[0]));
        }
    }, <DiceChooser />);
}

export default chooseDice;