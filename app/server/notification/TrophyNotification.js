const AppNotification = require('./AppNotification')

class TrophyNotification extends AppNotification{
    constructor(to, trophy) {
        super(to);
        this._trophy = trophy;
    }


    send() {
        let r = super.send()
        r['type'] = "unlock"
        r['data'] = this._trophy.toJson()
        return r
    }

}
module.exports = TrophyNotification
