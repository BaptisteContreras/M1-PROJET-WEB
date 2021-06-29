const AppNotification = require('./AppNotification')


class GameNotification extends AppNotification{
    constructor(to, msg) {
        super(to);
        this._msg = msg;
    }


    send() {
        let r = super.send()
        r['type'] = "game"
        r['data'] = this._displayMsg()
        return r
    }
    _displayMsg(){
        switch (this._msg) {
            case 'gamestart': return 'La partie commence';
            case 'gameend': return 'La partie est finie';
            case 'manchestart': return 'La manche commence';
            case 'mancheend': return 'La manche est finie';
            case 'joinlobby': return 'Vous avez rejoins un lobby';
            case 'leavelobby': return 'Vous avez quitté un lobby';
            default: return '';
        }
    }
}

module.exports = GameNotification

