module.exports = function (app, db) {
    //update table with results
    app.post('/sinus/:id', function(req, res) {
        var id = req.params.id || 0;
        var {
            period,
            congestion,
            post_nasal_drip,
            facial_pain,
            headache,
            cough,
            add_treatment,
            other_symp, 
            severity_result,
            comparative_score 
        } = req.body;

        var sql = "INSERT INTO `updatesinus` (" +
            "`period`," +
            "`congestion`," + 
            "`post_nasal_drip`," + 
            "`facial_pain`," + 
            "`headache`," + 
            "`cough`," +  
            "`add_treatment`," + 
            "`other_symp`," +
            "`severity_result`," +
            "`comparative_score`," +
            "`patient_id`" + 
            ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.query(sql,  [
            period,
            congestion,
            post_nasal_drip,
            facial_pain,
            headache,
            cough,
            add_treatment,
            other_symp,
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

    //get comparative score

};
