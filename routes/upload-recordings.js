// code for busboy gotten of off npm site https://www.npmjs.com/package/busboy

var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var ffmpeg = require('ffmpeg');

const reportFile = Date.now(); 

module.exports = function (app) {
    app.post('/', function (req, res) {
        const busboy = new Busboy({ headers: req.headers });
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
          const saveTo = path.join('.', filename);
          console.log('Uploading: ' + saveTo);
          file.pipe(fs.createWriteStream(saveTo));
          blobToMP3(saveTo);
        });
        busboy.on('finish', function() {
          console.log('Upload complete');
          res.writeHead(200, { 'Connection': 'close' });
          res.end("That's all folks!");
        });
        return req.pipe(busboy);
    });
};

//encode file to mp3
// This function was taken from the speech recording tutorial from jermy gottfrieds
// located at https://medium.com/jeremy-gottfrieds-tech-blog/javascript-tutorial-record-audio-and-encode-it-to-mp3-2eedcd466e78

function blobToMP3(filePath) {
    try{
        console.log('try...', filePath);
        var process = new ffmpeg (filePath);
        process.then(function (audio){
            console.log('process audio');
            audio.fnExtractSoundToMP3(path.join(__dirname, '../www/assets/audio/' + reportFile + '.mp3'), 
            function(error, file){
                if(!error) {
                    console.log('Audio file: ' + file);
                }
                console.log(error);
            });
        }, function (err) {
            console.log('Error ' + err);
        });
    }
    catch(e){
        console.log(e.code);
        console.log(e.msg);
    }
}
