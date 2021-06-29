const db = require('../storage/DataBase')()

'use strict';


exports.getTrophyList = function () {
    return new Promise(function(resolve, reject) {
        resolve(db.getAll("trophies"));
    });
}
