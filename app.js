var config = require('./configuration/config.js');
var path  = require("path");
var mysql = require('mysql');
var bodyParser = require('body-parser');
var fs = require('fs');


//start mysql connection
var db = mysql.createConnection({
    host: "xxx",
    user: "xxx",
    password: "xxx",
    database: "xxx"
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
 require('./routes/create-tables')(app, db);
 require('./routes/sinus-questions')(app, db, scenarioHelper);
 require('./routes/end-questions')(app, db, scenarioHelper);
 require('./routes/objective-questions')(app, db, scenarioHelper);
 require('./routes/accounts')(app, db);
 require('./routes/basescores')(app, db);
 require('./routes/chest-question')(app, db, scenarioHelper);
 require('./routes/gi-questions')(app, db, scenarioHelper);
 require('./routes/branch-questions')(app, db, scenarioHelper);
 require('./routes/updateTables/Gi/abdominal')(app, db);
 require('./routes/updateTables/Gi/constipation')(app, db);
 require('./routes/updateTables/Gi/diarrhoea')(app, db);
 require('./routes/updateTables/sinus')(app, db);
 require('./routes/updateTables/Gi/vomit')(app, db);
 require('./routes/updateTables/Gi/heartburn')(app, db);
 require('./routes/updateTables/Chest/cough')(app, db);
 require('./routes/updateTables/Chest/breath')(app, db);
 require('./routes/updateTables/Chest/blood')(app, db);
 require('./routes/updateTables/Chest/discomfort')(app, db);
 require('./routes/updateTables/Chest/additional')(app, db);
 require('./routes/updateTables/objective')(app, db);
 //create app server

app.listen(config.port, function () {
    logger.trace("Application listening on port", config.port);
})



