//configuration for amazon polly
var path  = require("path"); 

module.exports = {
    //put files in folder
    speechPath: path.join(__dirname, '../', '/assets/'),
    voice: "Amy",
    port: 4000,
    region: 'us-east-1',
    //change access keys 

}