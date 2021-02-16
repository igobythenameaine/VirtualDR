module.exports = function (app, db) {
    //update results into DB
    app.post('/heartburn/:id', function(req, res) {
        var id = req.params.id || 0;
        var {
            heartburn,
            heartburn_period,
            heartburn_times,
            heartburn_deteriorate,
            severity_result,
            comparative_score 
        } = req.body;

        var sql = "INSERT INTO `updateHeartburn` (" +
            "`heartburn`," +
            "`heartburn_period`," + 
            "`heartburn_times`," + 
            "`heartburn_deteriorate`," + 
            "`severity_result`," + 
            "`comparative_score`," + 
            "`patient_id`" + 
            ") VALUES (?, ?, ?, ?, ?, ?, ?)";

        db.query(sql, [
            heartburn,
            heartburn_period,
            heartburn_times,
            heartburn_deteriorate,
            severity_result,
            comparative_score, 
            id
        ] , function(err, result) {
            if(err) throw err;
            console.log(result);
            console.log("1 record inserted");
            res.end();
    });
    });

};
