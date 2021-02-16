module.exports = function (app, db) {
    //update results into DB
    app.post('/blood/:id', function(req, res) {
        var id = req.params.id || 0;
        var {
            blood_in_sputum,
            red_flag_one,
            amount,
            period,
            unwell,
            blood_other_symp,
            severity_result,
            comparative_score 
        } = req.body;

        var sql = "INSERT INTO `updateBlood` (" +
            "`blood_in_sputum`," +
            "`red_flag_one`," + 
            "`amount`," + 
            "`period`," + 
            "`unwell`," + 
            "`blood_other_symp`," +
            "`severity_result`," + 
            "`comparative_score`," + 
            "`patient_id`" + 
            ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.query(sql, [
            blood_in_sputum,
            red_flag_one,
            amount,
            period,
            unwell,
            blood_other_symp,
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
