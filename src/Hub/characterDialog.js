import React from 'react';
import showDialog from '../Dialog/show';
import etherpadserver from './etherpadserver.json';
import { Tabs, Tab, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PortraitEditor from './PortraitEditor';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
    },
    tabs: {
        minWidth: 90,
        width: 90,
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    tab: {
        minWidth: 'unset',
    },
    tabPanel: {
        overflowY: 'scroll',
    },
    pad: {
        border: 'none',
        width: 400,
        height: '50vh',
        borderRadius: 10,
        padding: 3
    },
    characterSelector: {
        '& > button > span': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }
    },
    portrait: {
        width: 100,
        height: 100,
        objectFit: 'contain'
    }
}));

function DialogCentre(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(props.startingValue);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    let index = 0;

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                classes={{
                    root: classes.tabs,
                }}
            >
                <Tab className={classes.tab} label="Info" />
                {props.self || props.amDM ? <Tab className={classes.tab} label="Inventory" /> : null}
                {props.self || props.amDM ? <Tab className={classes.tab} label="Notes" /> : null}
                {props.self ? <Tab className={classes.tab} label="Portrait" /> : null}
                <Tab className={classes.tab} label="All Chars" />
            </Tabs>
            <TabPanel classes={classes.tabPanel} value={value} index={index++}>
                <iframe name="embed_readwrite" className={classes.pad} src={`${etherpadserver}/p/${props.character.id}_info`}></iframe>
            </TabPanel>
            {props.self || props.amDM ? <TabPanel classes={classes.tabPanel} value={value} index={index++}>
                <iframe name="embed_readwrite" className={classes.pad} src={`${etherpadserver}/p/${props.character.id}_inv`}></iframe>
            </TabPanel> : null}
            {props.self || props.amDM ? <TabPanel classes={classes.tabPanel} value={value} index={index++}>
                <iframe name="embed_readwrite" className={classes.pad} src={`${etherpadserver}/p/${props.character.id}_notes`}></iframe>
            </TabPanel> : null}
            {props.self ? <TabPanel classes={classes.tabPanel} value={value} index={index++}>
                <PortraitEditor {...props.character} />
            </TabPanel> : null}
            <TabPanel classes={classes.tabPanel} value={value} index={index++}>
                <div className={classes.characterSelector}>
                    {props.hubInfo.characters.map(char => (
                        <Button onClick={() => {
                            setValue(0);
                            showCharacterDialog(char, props.hubInfo, props.myName, props.amDM, 0);
                        }}>
                            <Typography>{char.name}</Typography>
                            <img className={classes.portrait} src={char.portraits[char.portraitSelected]} />
                        </Button>
                    ))}
                </div>
            </TabPanel>
        </div>
    );
};

function showCharacterDialog(character, hubInfo, myName, amDM, startingValue) {
    showDialog({
        title: character.name
    }, <DialogCentre character={character} hubInfo={hubInfo} myName={myName} self={myName == character.name} amDM={amDM} startingValue={startingValue} />);
}

export default showCharacterDialog;