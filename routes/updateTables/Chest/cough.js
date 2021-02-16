module.exports = function (app, db) {
    //update results into DB
    app.post('/cough/:id', function(req, res) {
        var id = req.params.id || 0;
        var {
            cough,
            ordinarily,
            different,
            cough_period,
            sputum,
            colour,
            difColour,
            much,
            easily,
            blood,
            add_cough_treatment,
            other_cough_symp,
            severity_result,
            comparative_score 
        } = req.body;

        var sql = "INSERT INTO `updateCough` (" +
            "`cough`," +
            "`ordinarily`," + 
            "`different`," + 
            "`cough_period`," + 
            "`sputum`," + 
            "`colour`," + 
            "`difColour`," + 
            "`much`," +
            "`easily`," +
            "`blood`," +
            "`add_cough_treatment`," + 
            "`other_cough_symp`," +
            "`severity_result`," + 
            "`comparative_score`," + 
            "`patient_id`" + 
            ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.query(sql, [
            cough,
            ordinarily,
            different,
            cough_period,
            sputum,
            colour,
            difColour,
            much,
            easily,
            blood,
            add_cough_treatment,
            other_cough_symp,
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
