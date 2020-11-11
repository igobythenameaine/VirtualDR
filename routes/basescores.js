module.exports = function (app, db) {

    const sql = "SELECT patient_id, sinus_basescore, chest_basescore, gi_basescore FROM `patients`";

    db.query(sql, function(err, result) {
        if(err) throw err;
        console.log(result);
    });

    app.get('/basescores', function(req, res) {
            db.query(sql, function(err, result) {
                    if(err) throw err;
                    console.log(result);
                     res.end(JSON.stringify(result));
        });
    });
};