var express = require('express');
var router = express.Router();
const checkAuth = require('../utils/auth');
var utils = require('../utils/writer.js');
var Georesources = require('../service/GeoresourcesService');


router.get('/resources/:resourceId', function (req, res) {
    checkAuth(req.get('authentication'), req.get('origin'))
        .then(() => {
            console.log(req.params);
            Georesources.resourcesGETOne(req.params.resourceId)
                .then(function (response) {
                    if (response && response) {
                        utils.writeJson(res, response);
                    } else {
                        res.status(404).send('Resource not found.');
                    }
                })
                .catch(function (response) {
                    console.log(response);
                    console.log("erreur");
                    res.status(500).send('Technical error.');
                });
        })
        .catch(() => {
            res.status(401).send('No auth');
        });


});

module.exports = router;
