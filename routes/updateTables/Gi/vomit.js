module.exports = function (app, db) {
    //update results into DB
    app.post('/vomit/:id', function(req, res) {
        var id = req.params.id || 0;
        var {
            vomit,
            when,
            times,
            blood,
            vomit_eating,
            nauseous,
            vomit_abdominal_pain,
            severity_result,
            comparative_score 
        } = req.body;

        var sql = "INSERT INTO `updateVomit` (" +
            "`vomit`," +
            "`when`," + 
            "`times`," + 
            "`blood`," + 
            "`vomit_eating`," + 
            "`nauseous`," +
            "`vomit_abdominal_pain`," + 
            "`severity_result`," + 
            "`comparative_score`," + 
            "`patient_id`" + 
            ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.query(sql, [
            vomit,
            when,
            times,
            blood,
            vomit_eating,
            nauseous,
            vomit_abdominal_pain,
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
