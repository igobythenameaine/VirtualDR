var express = require('express');
var router = express.Router();
//handle requests 
module.exports = function (config, logger) {
    router.use(function (req, res, next) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        next();
    });

    router.get('/getnext/:id', function (req, res) {
        var scenes = req.scenario.scenes;
        var id = req.params.id || ""; //will return parameters in the matched route
        var position = req.scenario.position;
        logger.trace(req.scenario);
            position.scene = req.scenario.script[0];
            position.block = id;
            position.offset = 0

        res.end(JSON.stringify({...scenes[position.scene][position.block][position.offset], id}));
    })

    router.get('/speech/:id', function (req, res) {
        var id = req.params.id;
        var path = config.speechPath + config.voice + id + ".mp3";
        logger.trace("Serving speech file", path)
        res.sendFile(path);
    });
    router.get('/speechv/:id', function (req, res) {
        var id = req.params.id;
        var path = config.speechPath + config.voice + id + ".json";
        logger.trace("Serving viseme file", path)
        res.sendFile(path);
    });

    return router;
}


