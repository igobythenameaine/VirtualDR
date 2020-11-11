
//prepare sinus questions from database

module.exports = function (app, db, scenarioHelper) {
    const sql = "SELECT id, text, speechid FROM `end_question`";
    //parpare questions and call ttsHelper to generate mp3, json and txt file from sinus_questions
    db.query(sql, function(err, result) {
        if(err) throw err;
        scenarioHelper.prepareQuestions(result);
    });

    app.get('/end-questions', function(req, res) {
        db.query(sql, function(err, result) {
    const sql = "SELECT id, text, speechid FROM `end_question`";
            if(err) throw err;

            //change format of results to call questions using id
            //form
            //2:
            //id: "runny_nose"
            //speechid: "2e14da21ad762423ac4bd3de0af4321c"
            //text: "Do you have a runny nose?"
            //to
            //runny_nose:
            //id: "runny_nose"
            //speechid: "2e14da21ad762423ac4bd3de0af4321c"
            //text: "Do you have a runny nose?"

            var normalisedResult = {};
            result.forEach(item => {
                normalisedResult[item.id] = item; 
            });
            res.end(JSON.stringify(normalisedResult));
        });
    });
 };