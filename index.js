const express = require('express');
const { Hub } = require('./hub.js');
const http = require('http');
var app = express();
var server = http.createServer(app);
const cfg = require('./cfg.json');
var io = new (require('socket.io').Server)(server);

app.use(express.static('build'));
if (cfg.dev) {
    const proxy = require('express-http-proxy');
    app.use('/', proxy('http://localhost:3000'));
} else {
    app.use('/', express.static(__dirname + '/../build'));
}

server.listen(cfg.port, () => {
    console.log(`Server started on port ${cfg.port}!`);
});

io.on('connection', socket => {
    socket.character = null;
    socket.emit('chars', hub.ingameInfo.characters);

    socket.on('chooseChar', name => {
        if (socket.character == null && hub.characterExists(name)) hub.getCharacter(name).choose(socket);
        else socket.emit('err');
    });

    socket.on('createChar', (name, owner) => {
        if (hub.createCharacter(name, owner, socket)) socket.emit('refresh');
        else socket.emit('err', 'Couldn\'t create a character with that name, does one already exist?');
    });

    socket.on('renameChar', (oldName, newName, newOwner) => {
        if (hub.characterExists(oldName)) {
            hub.getCharacter(oldName).rename(newName, newOwner);
            socket.emit('refresh');
        }
    });

    socket.on('createPad', pad => {
        if (pad.length > 0)
            hub.createPad(pad);
    });

    socket.on('changePad', (index, pad) => {
        hub.changePad(index, pad);
    });

    socket.on('deletePad', pad => {
        hub.deletePad(pad);
    });

    socket.on('roll', dice => {
        if (socket.character != null)
            socket.character.roll(dice);
    });

    socket.on('addPortrait', url => {
        if (socket.character != null)
            socket.character.addPortrait(url);
    });

    socket.on('changePortrait', index => {
        if (socket.character != null)
            socket.character.changePortrait(index);
    });

    socket.on('disconnect', () => {
        if (socket.character != null) {
            socket.character.socket = null;
            hub.sendInfoToAll();
        }
    });
});

var hub = new Hub();
hub.io = io;