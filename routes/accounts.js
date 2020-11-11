//the form data will be sent to the server.
//With that data our login script will check in our MySQL accounts table to see if the details are correct.
//code sourced from https://codeshack.io/basic-login-system-nodejs-express-mysql/

module.exports = function (app, db) {

    var path = require("path");
    var session = require('express-session');

    //session config used to check user is logged in
    app.use(session({
        secret: 'test',
        resave: true,
        saveUninitialized: true
    }));

    //create Patients loggin directs to Virtual Doctor
    app.post('/auth', function (req, res) {
        var username = req.body.username;
        var password = req.body.password;

        if (username && password) {
            db.query('SELECT * FROM patients WHERE username = ? AND password = ?',
                [username, password], function (error, results, fields) {
                    if (results.length > 0) {
                        req.session.loggedin = true;
                        // change secure to true if https
                        res.cookie('patientId', results[0].patient_id, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false, secure: false });
                        res.redirect('/home');
                    } else {
                        res.send('Incorrect Username and/or Password!');
                    }
                    res.end();
                });
        } else {
            res.send('Please enter Username and Password!');
            res.end();
        }
    });

    app.post('/patient/:id', function (req, res) {
        var id = req.params.id

        if (id) {
            db.query('SELECT patient_id, sinus_basescore, chest_basescore, gi_basescore FROM patients WHERE patient_id = ?',
                [id], function (error, result) {
                    if (error) throw error;
                    console.log(result[0]);
                    res.end(JSON.stringify(result[0]));
                });
        } else {
            res.send('No patient id!');
            res.end();
        }
    });

    app.get('/home', function (req, res) {
        if (req.session.loggedin) {

            // db.query(sql, function(err, result) {
            //         if(err) throw err;
            //         console.log(result);
            //         // res.end(JSON.stringify(result));
            //     });

            res.sendFile(path.join(__dirname, '../', 'www/home.html'));
        } else {
            res.send('Please login to view this page!');
        }
    });






};
