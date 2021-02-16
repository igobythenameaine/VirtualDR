module.exports = function (app, db) {
    //update results into DB
    app.post('/discomfort/:id', function(req, res) {
        var id = req.params.id || 0;
        var {
            chest_discomfort,
            chest_period,
            start,
            red_flag_two,
            what,
            time,
            chest_worse,
            pain,
            chest_breathing,
            shortness_of_breath,
            chest_other_symp,
            severity_result,
            comparative_score 
        } = req.body;

        var sql = "INSERT INTO `updateDiscomfort` (" +
            "`chest_discomfort`," +
            "`chest_period`," + 
            "`start`," + 
            "`red_flag_two`," + 
            "`what`," + 
            "`time`," +
            "`chest_worse`," + 
            "`pain`," + 
            "`chest_breathing`," + 
            "`shortness_of_breath`," + 
            "`chest_other_symp`," +
            "`severity_result`," + 
            "`comparative_score`," + 
            "`patient_id`" + 
            ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.query(sql, [
            chest_discomfort,
            chest_period,
            start,
            red_flag_two,
            what,
            time,
            chest_worse,
            pain,
            chest_breathing,
            shortness_of_breath,
            chest_other_symp,
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
