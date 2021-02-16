module.exports = function (app, db) {
    //update results into DB
    app.post('/objective/:id', function(req, res) {
        var id = req.params.id || 0;
        var {
            spirometer_yes,
            spirometer_no,
            spirometer_input,
            spirometer_percentage,
            oxygen_yes,
            oxygen_no,
            oxygen_input,
            temperature_yes,
            temperature_no,
            temperature_input,
            objective_score,
        } = req.body;

        var sql = "INSERT INTO `updateObjective` (" +
            "`spirometer_yes`," + 
            "`spirometer_no`," +
            "`spirometer_input`," +
            "`spirometer_percentage`," + 
            "`oxygen_yes`," + 
            "`oxygen_no`," +
            "`oxygen_input`," +
            "`temperature_yes`," + 
            "`temperature_no`," + 
            "`temperature_input`," + 
            "`objective_score`," + 
            "`patient_id`" + 
            ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.query(sql, [
            spirometer_yes,
            spirometer_no,
            spirometer_input,
            spirometer_percentage,
            oxygen_yes,
            oxygen_no,
            oxygen_input,
            temperature_yes,
            temperature_no,
            temperature_input,
            objective_score,
            id
        ] , function(err, result) {
            if(err) throw err;
            console.log(result);
            console.log("1 objective inserted");
            res.end();
    });
    });

};
