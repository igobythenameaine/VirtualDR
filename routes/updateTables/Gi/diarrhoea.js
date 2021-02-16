module.exports = function (app, db) {
    //update results into DB
    app.post('/diarrhoea/:id', function(req, res) {
        var id = req.params.id || 0;
        var {
            diarrhoea,
            diarrhoea_period,
            diarrhoea_bowel_motion,
            still,
            diarrhoea_blood,
            diarrhoea_abdominal_pain,
            abdominal_cramps,
            diarrhoea_eating,
            severity_result,
            comparative_score 
        } = req.body;

        var sql = "INSERT INTO `updateDiarrhoea` (" +
            "`diarrhoea`," +
            "`diarrhoea_period`," + 
            "`diarrhoea_bowel_motion`," + 
            "`still`," + 
            "`diarrhoea_blood`," + 
            "`diarrhoea_abdominal_pain`," + 
            "`abdominal_cramps`," + 
            "`diarrhoea_eating`," + 
            "`severity_result`," + 
            "`comparative_score`," + 
            "`patient_id`" + 
            ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.query(sql, [
            diarrhoea,
            diarrhoea_period,
            diarrhoea_bowel_motion,
            still,
            diarrhoea_blood,
            diarrhoea_abdominal_pain,
            abdominal_cramps,
            diarrhoea_eating,
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
