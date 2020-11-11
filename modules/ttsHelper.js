const AWS = require('aws-sdk');

//making files the text files, mp3 files, json files from using amazon polly

const q = require('q');
const fs = require('fs');

var TTS = function (defaultVoice, config, logger) {

    const Polly = new AWS.Polly({
        signatureVersion: 'v4',
        region: config.region, 
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    });
    

    logger.trace("Building TTS helper");

    var self = this;
    self.defaultVoice = defaultVoice;

    self.getSpeech = function(text, fileId) {
        var deferred = q.defer();

        voice = self.defaultVoice;

        var path = config.speechPath;

        var fileName = path + voice + fileId;

        //check to see if file already exists
        if (fs.existsSync(fileName + ".txt")) {
            logger.trace("Speech already exists: ", text);
            deferred.resolve(true); 
            return deferred.promise;
        }
        logger.trace("Synthesizing speech for: ", text);

        var params = {
            'Text': text,
            'OutputFormat': 'mp3',
            'VoiceId': voice
        }

        //write speech files 
        Polly.synthesizeSpeech(params, (err, data) => {
            if (err) {
                console.log(err.code);
            } else if (data) {
                if (data.AudioStream instanceof Buffer) {
                    fs.writeFile(fileName + ".mp3", data.AudioStream, function (err) {
                        logger.trace("The mp3 file was saved");
                        if (err) {
                            return console.log(err)
                        };

                        //json file contain the metadata
                        params.OutputFormat = "json";
                        params.SpeechMarkTypes = ['word', 'viseme'];
                        Polly.synthesizeSpeech(params, (err, data) => {
                            if (err) {
                                console.log(err.code)
                            } else {
                                fs.writeFile(fileName + ".json", data.AudioStream, function () { });
                                fs.writeFileSync(fileName + ".txt", text);
                           }
                            deferred.resolve(true);
                        });
                    })
                }
            }
        });

        return deferred.promise;
    }
}

module.exports = TTS;