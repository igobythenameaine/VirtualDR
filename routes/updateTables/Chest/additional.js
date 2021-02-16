module.exports = function (app, db) {
    //update results into DB
    app.post('/additional/:id', function(req, res) {
        var id = req.params.id || 0;
        var {
            fever,
            appetite,
            sleep,
            drinking,
            fatigue,
        } = req.body;

        var sql = "INSERT INTO `updateAdditional` (" +
            "`fever`," +
            "`appetite`," + 
            "`sleep`," + 
            "`drinking`," + 
            "`fatigue`," + 
            "`patient_id`" + 
            ") VALUES (?, ?, ?, ?, ?, ?)";

        db.query(sql, [
            fever,
            appetite,
            sleep,
            drinking,
            fatigue,
            id
        ] , function(err, result) {
            if(err) throw err;
            console.log(result);
            console.log("1 record inserted");
            res.end();
    });
    });

};
