module.exports = function (app, db, scenarioHelper) {
    //get question from DB
    const sql = 
    "SELECT id, text, speechid FROM `gi_question` UNION SELECT id, text, speechid FROM `constipation_question` UNION SELECT id, text, speechid FROM `diarrhoea_question` UNION SELECT id, text, speechid FROM `abdominal_question` UNION SELECT id, text, speechid FROM `vomit_question` UNION SELECT id, text, speechid FROM `heartburn_question`"; 
    db.query(sql, function(err, result) {
        if(err) throw err;
        scenarioHelper.prepareQuestions(result);
    });

    app.get('/gi-questions', function(req, res) {
        db.query(sql, function(err, result) {
            if(err) throw err;
            var normalisedResult = {};
            result.forEach(item => {
                normalisedResult[item.id] = item; 
            });
            res.end(JSON.stringify(normalisedResult));
        });
    });
};