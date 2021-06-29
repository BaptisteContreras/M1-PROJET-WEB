const db = require('../storage/DataBase')()
var trophyService = require('../service/TrophyService');
var notificationDispatcher = require('../notification/NotificationDispatcher')();

'use strict';



exports.playerRefresh = function(el) {
    return new Promise(async function(resolve, reject) {

        var player = {
            "id": el,
            "role": "player",
            "position": {
               'lat' :45.78207,
                'lng' : 4.86559
            },
            "ttl": 0,
            "url": null,
            "blurred": false,
            "status": "alive",
            "owned" : []

        }
        let trophies = await trophyService.getTrophyList()
        let playerList = []
        for(let trophy in trophies){
            playerList.push({
                "id": trophies[trophy].id,
                "done": false,
            })

        }
        player["trophy"] = playerList;
        db.addElement("resources", player)
        resolve(player);

    });
}
exports.deletePlayer = function(player) {
    db.deleteElement('resources', player)
}

exports.initPlayerGame = function(player) {
    let p = db.getElement('resources', player)
    p.owned = []
}
exports.getAll = function() {
   return db.debug2()
}

exports.getNotifications = function(player) {
    return new Promise(async function(resolve, reject) {
        resolve(notificationDispatcher.flush(player))
    });

}
