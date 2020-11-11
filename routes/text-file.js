//save data AS CSV File
//https://stackoverflow.com/questions/17188337/nodejs-csv-data-export-system-for-users

module.exports = function (fs, db, app) {

app.post('/text-file/', function(req, res) {
    
    var reportFile = "transcript";
    // Date.now();  
    const sql = "SELECT * FROM `updatesinus`";
    // UNION SELECT * FROM `updateconstipation`";
    db.query(sql, function(err, results, fields){
            
        fs.closeSync(fs.openSync(__dirname + '/reports/' + reportFile + '.csv', 'w')); 

        var attributes = [];

        var row = [];

        for(var x = 0; x<fields.length; x++) attributes.push(fields[x].name);
        fs.appendFile(__dirname + '/reports/' + reportFile + '.csv', attributes.join(','), function (err) {
            
            if(err) 
            console.log('Error appending fields', err);
            fs.appendFileSync(__dirname + '/reports/' + reportFile + '.csv', '\n');

            for(var x = 0; x<results.length; x++) {
                row = [];
                for(var y = 0; y<attributes.length; y++){
                    row.push(results[x][attributes[y]]);
                } 
                fs.appendFileSync(__dirname + '/reports/' + reportFile + '.csv', row.join(','));   
                fs.appendFileSync(__dirname + '/reports/' + reportFile + '.csv', '\n'); 
            }  
        });   
    })

})  
};

