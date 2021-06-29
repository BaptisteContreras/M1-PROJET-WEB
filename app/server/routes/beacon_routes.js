const checkAuth = require('../utils/auth');
var gameService = require('../service/GameService');
var express = require('express');
var router = express.Router();

router.post('/players/:player/leaveAll', function (req, res) {
    let player = req.params.player;
    checkAuth(req.body.headers.Authentication, undefined)
        .then(async (authResp) => {
            if (player){
                let can = await gameService.leaveAllWaitingRooms(player)
                res.end()
            }else {
                res.status(400).send('Missing parameters');
            }
        })
        .catch(() => {
            res.status(401).send('No auth');
        });

});

module.exports = router;
