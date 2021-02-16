module.exports = function (app, db, scenarioHelper) {
    const sql = 
    //get questions from DB
    "SELECT id, text, speechid, guide FROM `chest_question` UNION SELECT id, text, speechid, guide FROM `cough_question` UNION SELECT id, text, speechid, guide FROM `short_breath_question` UNION SELECT id, text, speechid, guide FROM `haemoptyis_question` UNION SELECT id, text, speechid, guide FROM `chest_discomfort_question` UNION SELECT id, text, speechid, guide FROM `additional_question`"; 

    db.query(sql, function(err, result) {
        if(err) throw err;
        scenarioHelper.prepareQuestions(result);
    });

    app.get('/chest-question', function(req, res) {
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