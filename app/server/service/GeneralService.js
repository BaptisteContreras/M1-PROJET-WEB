const db = require('../storage/DataBase')()


exports.generalGet = function() {
    return new Promise(function(resolve, reject) {

        resolve(db.getAll('general')[0])
    });
}

exports.updateFields = function(fields) {
    db.updateElement('general', '1', fields)
}

