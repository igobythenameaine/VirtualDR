var q = require('q');
var crypto = require('crypto');

module.exports = function (config, logger) {

    var ttsHelper = new (require('./ttsHelper.js'))(config.voice, config, logger);

    var self = this;

    self.prepareScene = function(scene) {
        logger.trace("Preparing scene");
        var deferred = q.defer();

        var lines = [];

        //create random speech id for each line

        for (var key in scene) {
            for (var i = 0; i < scene[key].length; i++) {
                var line = scene[key][i].text;
                scene[key][i].speechid = crypto.createHash("md5").update(line).digest("hex");
                lines.push(ttsHelper.getSpeech.bind(null, line, scene[key][i].speechid));
            }
        }
        var chain = q();
        lines.forEach(function (f) {
            chain = chain.then(f);
        });

        chain.then(function (d) {
            deferred.resolve(true);
        });

        return deferred.promise;
    }
    
    //prepaing questions from scenarios/demo node script
    self.prepareScenario = function (scenario) {
        var script = scenario.script;
        var scenes = scenario.scenes;
        console.log('Preparing', JSON.stringify(script), JSON.stringify(scenes));
        scenario.position = {
            scene: script[0],
            block: "start",
            offset: 0
        };

        var deferred = q.defer();
        var promises = [];

        for (var i = 0; i < script.length; i++) {
            console.log(i, scenes[script[i]]);
            promises.push(self.prepareScene.bind(null, scenes[script[i]]));
        }

        var chain = q();
        promises.forEach(function (f) {
            chain = chain.then(f)
        });
        chain.then(function (d) {
            deferred.resolve();
        });

        return deferred.promise;
    }
    
//used to preparing the questions from database
    self.prepareQuestions = function (questions) {
        console.log('Preparing', JSON.stringify(questions));

        var deferred = q.defer();
        var promises = [];

        questions.forEach(question => {
            promises.push(ttsHelper.getSpeech.bind(null, question.text, question.speechid));
        });

        var chain = q();
        promises.forEach(function (f) {
            chain = chain.then(f)
        });
        chain.then(function (d) {
            deferred.resolve();
        });

        return deferred.promise;
    }

    return self;
}
