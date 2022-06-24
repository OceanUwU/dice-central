const fs = require('fs-extra');
const Character = require('./character.js');
const savePath = 'data/data.json';
const storeDirectly = ['pads', 'openPads'];

class Hub {
    constructor() {
        if (!fs.existsSync(savePath)) {
            console.log('No data! Have you followed the README?');
            require('process').exit();
        }

        let data = fs.readJSONSync(savePath);
        for (let i of storeDirectly)
            this[i] = data[i];
        
        this.characters = data.characters.map(char => new Character(char, this));
    }

    characterExists(name) {
        return this.getCharacter(name) != undefined;
    }

    getCharacter(name) {
        return this.characters.find(char => char.name == name);
    }

    createCharacter(name, owner) {
        if (!this.characterExists(name) && name != 'example') {
            let character = new Character({
                name: name,
                owner: owner,
                portraits: [0,1,2,3,4,5].map(n => `emptychar${n}.png`),
                portraitSelected: Math.floor(Math.random() * 6),
                dice: [],
            }, this);
            character.create();
            this.characters.push(character);
            this.sendAndSave();
            return true
        } else return false;
    }

    createPad(pad) {
        this.pads.push(pad);
        this.pads.sort((a, b) => a.localeCompare(b));
        this.sendAndSave();
    }

    changePad(index, pad) {
        this.openPads[index] = pad;
        this.sendAndSave();
    }

    deletePad(pad) {
        if (this.pads.includes(pad)) {
            this.pads = this.pads.filter(p => p !== pad);
            if (this.openPads.includes(pad))
                this.openPads = this.openPads.map(p => p === pad ? 'Notes' : p);
            this.sendAndSave();
        }
    }

    get info() {
        let output = {
            characters: this.characters.map(char => char.info),
        };
        for (let i of storeDirectly)
            output[i] = this[i];
        return output;
    }

    get ingameInfo() {
        return {
            ...this.info,
            online: this.characters.filter(char => char.socket != null).map(char => char.name),
        };
    }

    sendInfo(sockets) {
        let newInfo = this.ingameInfo;
        sockets.forEach(socket => socket.emit('info', newInfo));
    }

    sendAndSave() {
        this.save();
        this.sendInfoToAll();
    }

    sendInfoToAll() {
        this.io.to('hub').emit('info', this.ingameInfo);
    }

    save() {
        fs.writeJSONSync(savePath, this.info);
    }
}

module.exports = { savePath, Hub };