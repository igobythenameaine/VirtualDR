module.exports = function (app, db, scenarioHelper) {
    //get question from DB
    const sql = 
    "SELECT id, text, speechid, guide FROM `chest_branch_question`"; 
    db.query(sql, function(err, result) {
        if(err) throw err;
        scenarioHelper.prepareQuestions(result);
    });

    app.get('/branch-questions', function(req, res) {
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