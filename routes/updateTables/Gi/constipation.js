module.exports = function (app, db) {
    //update results into DB
    app.post('/constipation/:id', function(req, res) {
        var id = req.params.id || 0;
        var {
            constipation,
            constipation_period,
            constipation_bowel_motion,
            previous,
            constipation_abdominal_pain,
            bloated,
            passing_wind,
            constipation_eating,
            severity_result,
            comparative_score 
        } = req.body;

        var sql = "INSERT INTO `updateConstipation` (" +
            "`constipation`," +
            "`constipation_period`," + 
            "`constipation_bowel_motion`," + 
            "`previous`," + 
            "`constipation_abdominal_pain`," + 
            "`bloated`," + 
            "`passing_wind`," + 
            "`constipation_eating`," + 
            "`severity_result`," + 
            "`comparative_score`," + 
            "`patient_id`" + 
            ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.query(sql, [
            constipation,
            constipation_period,
            constipation_bowel_motion,
            previous,
            constipation_abdominal_pain,
            bloated,
            passing_wind,
            constipation_eating,
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
