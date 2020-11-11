var config = require('./configuration/config.js');
var path  = require("path");
var mysql = require('mysql');
var bodyParser = require('body-parser');
var fs = require('fs');
var nodemailer = require('nodemailer');

//for college server mysqli_connect('cs1.ucc.ie', 'ac57', 'siosh', 'mscim2019_ac57');

//start mysql connection
var db = mysql.createConnection({
    host: "192.168.64.2",
    user: "aine",
    password: "aine",
    database: "pdb"
});

db.connect(function(err) {
    if (err) throw(err);
    console.log("Connected!");
});
//end mysql connection

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'trace';

var express = require('express');
var morgan = require('morgan');

var api = require('./routes/api')(config, logger);


var scenario = require('./scenarios/demo');
var scenarioHelper = require('./modules/scenarioHelper.js')(config, logger);

scenarioHelper.prepareScenario(scenario);

var app = express();
app.use(morgan('combined'))
app.use("/", express.static(__dirname + "/www"));

app.use("*", function (req, res, next) {
    req.scenario = scenario;
    next();
})

app.use("/api", api);

//start body-parser configuration
//the bodyParser package will extract the form data from our .html file.

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//end body-parser configuratio

//display login page to user
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/www/login.html'));
});

 //connect routes
 require('./routes/upload-recordings')(app);
 require('./routes/create-tables')(app, db);
 require('./routes/text-file')(fs, db, app);
 require('./routes/send-mail')(app, fs, nodemailer);
 require('./routes/sinus-questions')(app, db, scenarioHelper);
 require('./routes/end-questions')(app, db, scenarioHelper);
 require('./routes/accounts')(app, db);
 require('./routes/basescores')(app, db);
 require('./routes/chest-question')(app, db, scenarioHelper);
 require('./routes/gi-questions')(app, db, scenarioHelper);
 require('./routes/updateTables/sinus')(app, db);
 require('./routes/updateTables/constipation')(app, db);

 //create app server

app.listen(config.port, function () {
    logger.trace("Application listening on port", config.port);
})



