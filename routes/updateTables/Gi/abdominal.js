module.exports = function (app, db) {
    //update results into DB
    app.post('/abdominal/:id', function(req, res) {
        var id = req.params.id || 0;
        var {
            abdominal_pain,
            abdominal_pain_period,
            abdominal_pain_sudden,
            all_time,
            deteriorate,
            severe,
            sharp,
            bowel_motion,
            abdominal_pain_diarrhoea,
            urine,
            abdominal_pain_eating,
            abdominal_pain_heartburn,
            severity_result,
            comparative_score 
        } = req.body;

        var sql = "INSERT INTO `updateAbsominal` (" +
            "`abdominal_pain`," +
            "`abdominal_pain_period`," + 
            "`abdominal_pain_sudden`," + 
            "`all_time`," + 
            "`deteriorate`," + 
            "`severe`," + 
            "`sharp`," + 
            "`bowel_motion`," +
            "`abdominal_pain_diarrhoea`," +
            "`urine`," +
            "`abdominal_pain_eating`," + 
            "`abdominal_pain_heartburn`," +
            "`severity_result`," + 
            "`comparative_score`," + 
            "`patient_id`" + 
            ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.query(sql, [
            abdominal_pain,
            abdominal_pain_period,
            abdominal_pain_sudden,
            all_time,
            deteriorate,
            severe,
            sharp,
            bowel_motion,
            abdominal_pain_diarrhoea,
            urine,
            abdominal_pain_eating,
            abdominal_pain_heartburn,
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
