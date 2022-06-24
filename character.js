const storeDirectly = ['id', 'name', 'owner', 'portraits', 'portraitSelected', 'dice'];
const idChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const idLength = 16;

class Character {
    constructor(data, hub) {
        this.hub = hub;
        for (let i of storeDirectly)
            this[i] = data[i];
        this.socket = null;
    }

    create() {
        this.id = '';
        for (let i = 0; i < idLength; i++)
            this.id += idChars[Math.floor(Math.random() * idChars.length)];
    }

    rename(name, owner) {
        if (name === this.name || (!this.hub.characterExists(name) && name != 'example')) {
            this.name = name;
            this.owner = owner;
            if (this.socket != null)
                this.socket.emit('name', this.name);
            this.hub.sendAndSave();
        }
    }

    choose(socket) {
        if (this.socket == null) {
            this.socket = socket;
            socket.character = this;
            socket.join('hub');
            socket.emit('name', this.name);
            this.hub.sendInfoToAll();
        } else socket.emit('err', 'Someone is already using this character.');
    }

    roll(dice) {
        this.dice = dice.map(d => [d, '']);
        this.hub.sendInfoToAll();
        this.determineRoll();
    }

    determineRoll() {
        setTimeout(() => {
            let rolling = this.dice.map((d, index) => d[1] == '' ? [true, index] : [false]).filter(d => d[0]);
            if (rolling.length > 0) {
                let toDetermine = rolling[Math.floor(Math.random() * rolling.length)][1];
                this.dice[toDetermine][1] = Math.ceil(Math.random() * this.dice[toDetermine][0]);
                this.hub.sendAndSave();
                if (rolling.length > 1)
                    this.determineRoll();
            }
        }, 250 + Math.ceil(Math.random() * 750));
    }

    addPortrait(url) {
        this.portraits.push(url);
        this.hub.sendInfoToAll();
    }

    changePortrait(index) {
        this.portraitSelected = index;
        this.hub.sendInfoToAll();
    }

    get info() {
        let output = {};
        for (let i of storeDirectly)
            output[i] = this[i];
        return output;
    }
}

module.exports = Character;