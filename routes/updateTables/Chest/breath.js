module.exports = function (app, db) {
    //update results into DB
    app.post('/breath/:id', function(req, res) {
        var id = req.params.id || 0;
        var {
            breath,
            breath_different,
            sudden,
            routine,
            affected,
            tightness,
            breath_add_treatment,
            breath_other_symp,
            severity_result,
            comparative_score 
        } = req.body;

        var sql = "INSERT INTO `updateBreath` (" +
            "`breath`," +
            "`breath_different`," + 
            "`sudden`," + 
            "`routine`," + 
            "`affected`," + 
            "`tightness`," +
            "`breath_add_treatment`," + 
            "`breath_other_symp`," +
            "`severity_result`," + 
            "`comparative_score`," + 
            "`patient_id`" + 
            ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.query(sql, [
            breath,
            breath_different,
            sudden,
            routine,
            affected,
            tightness,
            breath_add_treatment,
            breath_other_symp,
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
