class AppNotification {

    constructor(to) {
        this._to = to
    }

    send(){
        return {
            date : new Date()
        }
    }


    getTo() {
        return this._to;
    }
}

module.exports = AppNotification
