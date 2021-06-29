var express = require('express');
var router = express.Router();
var utils = require('../utils/writer.js');
var trophyService = require('../service/TrophyService');



router.get('/trophies', function (req, res) {
    trophyService.getTrophyList()
        .then(function (response) {
            utils.writeJson(res, response);

        });

});


module.exports = router;
