var crypto = require('crypto');

module.exports = function (app, db) {
//create database
app.get('/createpatientdb',(req, res) => {
    var sql = "CREATE DATABASE pdb";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("database created" + result);
      res.send('database working....')
    });
  });

//add accounts for patient loggin 

  app.get('/createusertable',(req, res) => {
    var sql = "Create TABLE patients (patient_id INT NOT NULL AUTO_INCREMENT, med_number VARCHAR(8) NOT NULL, username VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL, email varchar(100) NOT NULL, PRIMARY KEY(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('patient table working....')
    });
  });

  app.get('/alterusertable',(req, res) =>{
    var sql = "ALTER TABLE patients ADD COLUMN (sinus_basescore VARCHAR(3) NOT NULL, chest_basescore VARCHAR(3) NOT NULL, gi_basescore VARCHAR(3) NOT NULL)";
    db.query(sql, function(err, result){
       if(err) err;
       console.log("Yeayy!! Alter table is good" + result);
       res.send('patient table working....')
    });
});

  app.get('/addallinfo', (req, res) => {
    let patient = [
        ['123456', 'Sarah', 'test', 'test@test.com'],
        ['654321', 'John', 'password', 'johnt@test.com'],
        ['112211', 'Paul', 'testpassword', 'paul@test.com'],
        ['113311', 'xxx', 'testpd', 'one@test.com'],
        ['114411', 'vvv', 'testword', 'two@test.com'],
        ['115511', 'ooo', 'testpass', 'three@test.com'],
        ['116611', 'ppp', 'testassword', 'four@test.com'],
        ['117711', 'lll', 'assword', 'five@test.com'],
        ['118811', 'kkk', 'testpassd', 'six@test.com'],
        ['119911', 'jjj', 'tesword', 'seven@test.com']
    ];
    let sql = 'INSERT INTO patients (med_number, username, password, email) VALUES ?';
    db.query(sql, [patient], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Persons names added...');
    });
});
// app.get('/update-userinfo', function(req, res) {

//   let basescore = [ 
//     [4, 4, 0],
//     [2, 5, 0],
//     [3, 3, 1],
//     [0, 7, 0],
//     [0, 5, 0],
//     [3, 5, 4],
//     [0, 2, 0],
//     [0, 3, 0],
//     [0, 0, 4],
//     [0, 5, 0]
// ];
//   const sql = "UPDATE patients SET sinus_basescore = ?, chest_basescore = ?, gi_basescore = ? WHERE patient_id = ?";
//   db.query(sql, [basescore], (err, result) => {
//       if(err) throw err;
//               console.log("1 record updated");
//               res.send('info basescore added...')  
//           });
//   });




//add accounts for Doctors loggin 
app.get('/createDoctorTable',(req, res) => {
  var sql = "Create TABLE doctors (doc_id INT NOT NULL AUTO_INCREMENT, med_number VARCHAR(8) NOT NULL, username VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL, email varchar(100) NOT NULL, PRIMARY KEY(doc_id))";
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("table created" + result);
    res.send('doctor table working....')
  });
});

app.get('/addalldocinfo', (req, res) => {
  let patient = [
      ['123456', 'Doctor1', 'doc', 'test@test.com'],
      ['654321', 'Doctor2', 'docpassword', 'doc@test.com'],
      ['112211', 'Doctor3', 'testpassword', 'doctor@test.com'],
  ];
  let sql = 'INSERT INTO doctors (med_number, username, password, email) VALUES ?';
  db.query(sql, [patient], (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('doctors names added...');
  });
});

//create tables to be updated with patients responses

app.get('/createupdatwobjectivetable',(req, res) => {
  var sql = "CREATE TABLE updateObjective (patient_id INT, spirometer_yes VARCHAR(255), spirometer_no VARCHAR(255), spirometer_input VARCHAR(255), spirometer_percentage VARCHAR(255), oxygen_yes VARCHAR(255), oxygen_no VARCHAR(255), oxygen_input VARCHAR(255), temperature_yes VARCHAR(255), temperature_no VARCHAR(255), temperature_input VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log(" uppdate chest table created" + result);
    res.send('update chest table working....')
  });
});

app.get('/createupdatecoughtable',(req, res) => {
    var sql = "CREATE TABLE updateCough (patient_id INT, cough VARCHAR(255), ordinarily VARCHAR(255), different VARCHAR(255), cough_period VARCHAR(255), sputum VARCHAR(255), colour VARCHAR(255), difColour VARCHAR(255), much VARCHAR(255), easily VARCHAR(255), blood VARCHAR(255), add_cough_treatment VARCHAR(255), other_cough_symp VARCHAR(255), severity_score INT(10), comparative_score INT(10), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" uppdate chest table created" + result);
      res.send('update chest table working....')
    });
  });

  app.get('/createupdatebreathtable',(req, res) => {
    var sql = "CREATE TABLE updateBreath (patient_id INT, breath VARCHAR(255), breath_different VARCHAR(255), sudden VARCHAR(255), routine VARCHAR(255), affected VARCHAR(255), tightness VARCHAR(255), breath_add_treatment VARCHAR(255), breath_other_symp VARCHAR(255), severity_score INT(10), comparative_score INT(10), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" uppdate chest table created" + result);
      res.send('update chest table working....')
    });
  });

  app.get('/createupdatebloodtable',(req, res) => {
    var sql = "CREATE TABLE updateBlood (patient_id INT, blood_in_sputum VARCHAR(255), red_flag_one VARCHAR(255), amount VARCHAR(255), period VARCHAR(255), unwell VARCHAR(255), blood_other_symp VARCHAR(255), severity_score INT(10), comparative_score INT(10), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" uppdate chest table created" + result);
      res.send('update chest table working....')
    });
  });

  app.get('/createupdatediscomforttable',(req, res) => {
    var sql = "CREATE TABLE updateDiscomfort (patient_id INT, chest_discomfort VARCHAR(255), chest_period VARCHAR(255), start VARCHAR(255), red_flag_two VARCHAR(255), what VARCHAR(255), time VARCHAR(255), chest_worse VARCHAR(255), pain VARCHAR(255), chest_breathing VARCHAR(255), shortness_of_breath VARCHAR(255), chest_other_symp VARCHAR(255), severity_score INT(10), comparative_score INT(10), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" uppdate chest table created" + result);
      res.send('update chest table working....')
    });
  });

  app.get('/createupdatesinustable',(req, res) => {
    var sql = "CREATE TABLE updatesinus (patient_id INT, period VARCHAR(255), congestion VARCHAR(255), post_nasal_drip VARCHAR(255), facial_pain VARCHAR(255), headache VARCHAR(255), cough VARCHAR(255), add_treatment VARCHAR(255), other_symp VARCHAR(255),  severity_result INT(10), comparative_score INT(10), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" update sinus table created" + result);
      res.send('update sinus table working....')
    });
  });



  app.get('/createUpdateConstipationTable',(req, res) => {
    var sql = "Create TABLE updateConstipation (patient_id INT, constipation VARCHAR(255), constipation_period VARCHAR(255), constipation_bowel_motion VARCHAR(255), previous VARCHAR(255), constipation_abdominal_pain VARCHAR(255), bloated VARCHAR(255), passing_wind VARCHAR(255), constipation_eating VARCHAR(255), severity_result INT(10), comparative_score INT(10), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('constipation update table working....')
    });
  });

  app.get('/createupdateDiatable',(req, res) => {
    var sql = "CREATE TABLE updateDiarrhoea (patient_id INT, diarrhoea VARCHAR(255), diarrhoea_period VARCHAR(255), diarrheoa_bowel_motion VARCHAR(255), still VARCHAR(255), diarrhoea_blood VARCHAR(255), diarrhoea_abdominal_pain VARCHAR(255), abdominal_cramps VARCHAR(255), diarrhoea_eating VARCHAR(255),  severity_result INT(10), comparative_score INT(10), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" update sinus table created" + result);
      res.send('update sinus table working....')
    });
  });

  app.get('/createupdateAb',(req, res) => {
    var sql = "CREATE TABLE updateAbsominal (patient_id INT, abdominal_pain VARCHAR(255), abdominal_pain_period VARCHAR(255), abdominal_pain_sudden VARCHAR(255), all_time VARCHAR(255), deteriorate VARCHAR(255), severe VARCHAR(255), sharp VARCHAR(255), bowel_motion VARCHAR(255), abdominal_pain_diarrhoea VARCHAR(255), urine VARCHAR(255), abdominal_pain_eating VARCHAR(255), abdominal_pain_heartburn VARCHAR(255), severity_result INT(10), comparative_score INT(10), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" update sinus table created" + result);
      res.send('update sinus table working....')
    });
  });

  app.get('/createupdateVomit',(req, res) => {
    var sql = "CREATE TABLE updateVomit (patient_id INT, vomit VARCHAR(255), whe VARCHAR(255), times VARCHAR(255), blood VARCHAR(255), vomit_eating VARCHAR(255), nauseous VARCHAR(255), vomit_abdominal_pain VARCHAR(255), severity_result INT(10), comparative_score INT(10), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" update sinus table created" + result);
      res.send('update sinus table working....')
    });
  });


  app.get('/createupdateHearttable',(req, res) => {
    var sql = "CREATE TABLE updateHeartburn (patient_id INT, heartburn VARCHAR(255), heartburn_period VARCHAR(255), heartburn_times VARCHAR(255), heartburn_deteriorate VARCHAR(255), severity_result INT(10), comparative_score INT(10), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" update sinus table created" + result);
      res.send('update sinus table working....')
    });
  });

  app.get('/createaddupdatetable',(req, res) => {
    var sql = "CREATE TABLE updateAdditional (patient_id INT, fever VARCHAR(255), appetite VARCHAR(255), sleeping VARCHAR(255), drinking VARCHAR(255), fatigue VARCHAR(255), FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("update other table created" + result);
      res.send('update other table working....')
    });
  });

///////////////////add sinus questions///////////////////////////////////
  app.get('/createsinusquestion',(req, res) => {
    var sql = "Create TABLE sinus_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(255), UNIQUE KEY unique_id (id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('sinus question table working....')
    });
  });

  app.get('/addquestions', (req, res) => {
    let questions = [
        ['period', 'How long have you been having problems with your sinuses?'],//red
        ['congestion', 'Do you feel congested?'],//green
        ['post_nasal_drip', 'Do you have a post nasal drip?'],//green
        ['facial_pain', 'Do you have any facial pain?'], //green
        ['headache', 'Do you have a headache?'], //green
        ['cough', 'Has your chest been affected?'], //green
        ['add_treatment', 'Have you taken any additional treatment for your sinuses?'],//grey
        ['other_symp', 'Have you any other associated symptoms?'],//grey
    ];
    let sql = 'INSERT INTO sinus_question (id, text) VALUES ?';
    db.query(sql, [questions], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('questions are added...');
    });
}); 

app.get('/update-sinus-questions', function(req, res) {
  const sql = "SELECT  id, text, speechid FROM `sinus_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `sinus_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});

////////END QUESTIONS/////////////
app.get('/createEndQuestion',(req, res) => {
  var sql = "Create TABLE end_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(1000), speechid VARCHAR(255), guide VARCHAR(1000), UNIQUE KEY unique_id (id))";
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("table created" + result);
    res.send('end question table working....')
  });
});

app.get('/addEndquestions', (req, res) => {
  let questions = [
      ['end_sinus', 'Do you feel you have any other issue with chest pain or gastrointestinal?', 'Chest Pain, Gastrointestinal or No'],//red
      ['end_chest', 'Do you feel you have any other issue with your sinuses or gastrointestinal?', 'Sinuses, Gastrointestinal or No'],//green
      ['end_gas', 'Do you feel you have any other issue with your sinuses or chest pain?', 'Sinuses, Chest Pain or No'],
      ['end_cough_branch', 'Are you having any other issues with your chest?', 'Shortness of breath, Blood in Sputum, Chest Discomfort or None'],
      ['end_breath_branch', 'Are you having any other issues with your chest?', 'Cough, Blood in Sputum, Chest Discomfort or None'],
      ['end_blood_branch', 'Are you having any other issues with your chest?', 'Cough, Shortness of breath, Chest Discomfort or None'],
      ['end_discomfort_branch', 'Are you having any other issues with your chest?', 'Cough, Shortness of breath, Blood in Sputum or None'],
      ['end_con_barnch', 'Are you having any other gastrointestinal problems?', 'Diarrhoea, Abdominal Pain, Vomiting, Heartburn or Not at them Moment'],
      ['end_dia_barnch', 'Are you having any other gastrointestinal problems?', 'Constipation, Abdominal Pain, Vomiting, Heartburn or Not at them Moment'],
      ['end_ab_barnch', 'Are you having any other gastrointestinal problems?', 'Constipation, Diarrhoea, Vomiting, Heartburn or Not at them Moment'],
      ['end_vom_barnch', 'Are you having any other gastrointestinal problems?', 'Constipation, Diarrhoea, , Abdominal Pain, Heartburn or Not at them Moment'],
      ['end_heart_barnch', 'Are you having any other gastrointestinal problems?', 'Constipation, Diarrhoea, Abdominal Pain, Vomiting or Not at them Moment'],
      ['end_mild', 'Thank you for visiting the Virtual Doctor. Your session with me is now over. Your details have been sent, monitor your symptoms over the next 24 hours and someone will call you in the next 24 hours. If you feel we have not met your needs or assessed you fully please contact the staff. Have a good day', 'Thank you for visiting the Virtual Doctor. Your session with me is now over. Your details have been sent, monitor your symptoms over the next 24 hours and someone will call you in the next 24 hours. If you feel we have not met your needs or assessed you fully please contact the staff. Have a good day'],
      ['end_moderate', 'You have completed your session with me. Your details have been sent, Someone will call you in the next 24 hours. If you feel we have not met your needs or assessed you fully please contact the staff. Thank you for your visit today', 'You have completed your session with me. Your details have been sent, Someone will call you in the next 24 hours. If you feel we have not met your needs or assessed you fully please contact the staff. Thank you for your visit today'],
      ['end_severe', 'The questionnaire is now complete. Your details have been sent, Someone will call you as early as possible. If you feel we have not met your needs or assessed you fully please contact the staff.', 'The questionnaire is now complete. Your details have been sent, Someone will call you as early as possible. If you feel we have not met your needs or assessed you fully please contact the staff.'],
      ['end_urgent', 'Your session with me is over. Your details have been sent, please call the team as soon as possible.', 'Your session with me is over. Your details have been sent, please call the team as soon as possible.']
      //green
  ];
  let sql = 'INSERT INTO end_question (id, text, guide) VALUES ?';
  db.query(sql, [questions], (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('questions are added...');
  });
}); 

app.get('/update-end-questions', function(req, res) {
  const sql = "SELECT  id, text, speechid, guide FROM `end_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `end_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});

/////////////////////////add chest questions//////////////////////////////////
app.get('/createchestqtable',(req, res) => {
    var sql = "Create TABLE chest_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(500), UNIQUE KEY unique_id (id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('chest question table working....')
    });
  });

  app.get('/addchestquestions', (req, res) => {
    let questions = [
        ['chest','What is the main issue with your chest?']//grey
    ];

    let sql = 'INSERT INTO chest_question (id, text) VALUES ?';
    db.query(sql, [questions], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('questions are added...');
    });
}); 

app.get('/update-chest-questions', function(req, res) {
  const sql = "SELECT id, text, speechid FROM `chest_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `chest_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});

app.get('/createcoughtable',(req, res) => {
    var sql = "Create TABLE cough_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(500), UNIQUE KEY unique_id (id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('cough question table working....')
    });
  });

  app.get('/addcoughquestions', (req, res) => {
    let cough = [
        ['cough','Do you have a cough?'],//grey
        ['ordinarily','Do you ordinarily have a cough?'],//green
        ['different','Do you think your cough is different?'],//grey
        ['cough_period','When did it start?'],//red
        ['sputum','Are you bring up any sputum or phlegm?'],//green
        ['colour', 'What colour is it?'],//red
        ['difColour','Is this a different colour to what you ordinarily cough up?'],//yellow
        ['much','How much sputum are you bringing up?'],//red
        ['easily', 'Can you cough it up easily'],//green
        ['blood','Have you coughed up any blood?'],//green
        ['better','Has it gotten better, worse or the same?'],//green
        ['add_treatment','Have you taken any additional treatment for your sinuses?'],//grey
        ['other_symp', 'Have you any other associated symptoms?']//grey
    ];

        let sql = 'INSERT INTO cough_question (id, text) VALUES ?';
    db.query(sql, [cough], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('questions are added...');
    });
}); 

app.get('/update-cough-questions', function(req, res) {
  const sql = "SELECT id, text, speechid FROM `cough_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `cough_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});

app.get('/createbreathtable',(req, res) => {
    var sql = "Create TABLE short_breath_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(500), UNIQUE KEY unique_id (id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('short breath question table working....')
    });
  });

app.get('/addbreathquestions', (req, res) => {
    let breath = [
        ['breath','Are you short of breath?'],//grey
        ['breath_different','Are you more short of breath than you ordinarily would be?'],//green
        ['breath_period','For how long have you been more short of breath?'],//red
        ['sudden','Did you notice this change all of a sudden or was it gradual?'],//red
        ['routine', 'Has it affected your daily routine?'],//green
        ['affected','Have you been mildly, moderately or severely affected?'],//red
        ['tightness','Have you any associated pain or tightness?'],//green
        ['breath_add_treatment','Have you taken any additional treatment?'],//grey
        ['breath_other_symp', 'Have you any other associated symptoms?']//grey
    ];

        let sql = 'INSERT INTO short_breath_question  (id, text) VALUES ?';
    db.query(sql, [breath], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('questions are added...');
    });
}); 

app.get('/update-breath-questions', function(req, res) {
  const sql = "SELECT id, text, speechid FROM `short_breath_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `short_breath_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});

app.get('/createhaemptyistable',(req, res) => {
    var sql = "Create TABLE haemoptyis_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(500), UNIQUE KEY unique_id (id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('hae question table working....')
    });
  });

  app.get('/addhaequestions', (req, res) => {
    let questions = [
        ['blood_in_sputum','Have you coughed up some blood?'],//grey
        ['red_flag_one','Is this your first time coughing up blood?'],//grey
        ['amount','How much blood have you coughed up?'],//red
        ['period','How many times has this happened?'],//red
        ['unwell','Have you been unwell recently?'],//grey
        ['other_symp', 'Have you any other associated symptoms?']//grey
    ];

        let sql = 'INSERT INTO haemoptyis_question  (id, text) VALUES ?';
    db.query(sql, [questions], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('questions are added...');
    });
});

app.get('/update-hae-questions', function(req, res) {
  const sql = "SELECT id, text, speechid FROM `haemoptyis_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `haemoptyis_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});

app.get('/createchestpaintable',(req, res) => {
    var sql = "Create TABLE chest_discomfort_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(500), UNIQUE KEY unique_id (id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('chest pain question table working....')
    });
  });

  app.get('/addchestpainquestions', (req, res) => {
    let questions = [
        ['discomfort','Is your issue related to pain or discomfort in your chest?'],//grey
        ['chest_period','How long have you felt this pain or discomfort?'],//red
        ['start','Did it start all of a sudden or gradually?'],//red
        ['red_flag_two','Is the pain worse when you take a deep breath?'],//red
        ['what', 'What were you doing when it started?'],//grey
        ['time', 'Is the pain or discomfort there all of the time?'],//green
        //['sometimes','Are you having pain ot discomfort sometimes?'],//grey
        //['often','How often?'],//grey
        ['chest_worse', 'Has the pain or discomfort gotten worse?'],//green
        ['pain','Would you describe it as sharp?'],//green
        ['chest_breathing', 'Is it affecting your breathing?'],//green
        ['shortness_of_breath', 'Do you feel more short of breath?'],//green
        ['chest_other_symp', 'Have you any other associated symptoms?']//grey
    ];

        let sql = 'INSERT INTO chest_discomfort_question  (id, text) VALUES ?';
    db.query(sql, [questions], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('questions are added...');
    });
});

app.get('/update-chestpain-questions', function(req, res) {
  const sql = "SELECT id, text, speechid FROM `chest_discomfort_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `chest_discomfort_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});

app.get('/createbranchtable',(req, res) => {
  var sql = "Create TABLE chest_branch_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(500), guide VARCHAR(500), UNIQUE KEY unique_id (id))";
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("table created" + result);
    res.send('chest pain question table working....')
  });
});

app.get('/addbranchtable', (req, res) => {
  let questions = [
      ['sometimes','Are you having pain ot discomfort sometimes?', 'Documenting answers.<br>There is no specific answer required'],//grey
      ['often','How often?', 'Documenting answers.<br>There is no specific answer required']//grey
  ];

  let sql = 'INSERT INTO chest_branch_question  (id, text, guide) VALUES ?';
  db.query(sql, [questions], (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('questions are added...');
  });
})


  app.get('/update-branch-questions', function(req, res) {
    const sql = "SELECT id, text, speechid FROM `chest_branch_question`";
    db.query(sql, function(err, result) {
        if(err) throw err;
        result.forEach(row => {
            var fileId = crypto.createHash("md5").update(row.text).digest("hex");
            db.query("UPDATE `chest_branch_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
                if(err) throw err;
                console.log(row);
                console.log("1 record updated");
                // res.end();
            });
        })
        res.end(JSON.stringify(result));
    });
  });



app.get('/update-chestpain-questions', function(req, res) {
  const sql = "SELECT id, text, speechid FROM `chest_discomfort_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `chest_discomfort_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});

app.get('/createadditionaltable',(req, res) => {
    var sql = "Create TABLE additional_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(500), UNIQUE KEY unique_id (id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('additional question table working....')
    });
  });

  app.get('/addadditionalquestions', (req, res) => {
    let questions = [
        ['fever','Do you think you have a fever or have had a fever?'],//grey
        ['appetite','Has your appetite been affected?'],//grey
        ['sleep','Has your ability to sleep been affected?'],//grey
        ['drinking', 'Are you drinking enough fluids?'],//grey
        ['fatigue','Are you currently more fatigued?'],//grey
        ['final', 'Your session with me is over. If you are finished, please, state that you are finished. If you wish to continue, please, state what else you are having issues with?']
    ];

        let sql = 'INSERT INTO additional_question  (id, text) VALUES ?';
    db.query(sql, [questions], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('questions are added...');
    });
});

app.get('/update-additional-questions', function(req, res) {
  const sql = "SELECT id, text, speechid FROM `additional_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `additional_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});

//////////////////////add gi questions////////////////////////////////////////////

app.get('/creategiqtable',(req, res) => {
    var sql = "Create TABLE gi_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(500), UNIQUE KEY unique_id (id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('gi question table working....')
    });
  });

app.get('/addgiquestions', (req, res) => {
    let questions = [
        ['gi','What is the main issue with gastrointestinal?']//grey
    ];

    let sql = 'INSERT INTO gi_question (id, text) VALUES ?';
    db.query(sql, [questions], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('questions are added...');
    });
}); 

app.get('/update-gi-questions', function(req, res) {
  const sql = "SELECT id, text, speechid FROM `gi_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `gi_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});

app.get('/createconstipationtable',(req, res) => {
    var sql = "Create TABLE constipation_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(500), UNIQUE KEY unique_id (id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('constipation question table working....')
    });
  });

app.get('/addconstipationquestions', (req, res) => {
    let questions = [
        ['constipation','Have you been experiencing some constipation?'],//grey
        ['constipation_period','How long has this been a problem?'],//red
        ['constipation_bowel_motion','When did you last have a bowel motion?'],//red
        ['previous','Have you previously experienced problems with constipation?'],//yellow
        ['constipation_abdominal_pain', 'Have you any abdominal pain or discomfort?'],//green
        ['bloated','Do you feel bloated?'],//green
        ['passing_wind','Are you having problems passing wind?'],//green
        ['constipation_eating','Are you eating and drinking as you normally would?'],//green
        //['other_symp', 'Have you any other associated symptoms?']//grey
    ];

        let sql = 'INSERT INTO constipation_question  (id, text) VALUES ?';
    db.query(sql, [questions], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('questions are added...');
    });
}); 

app.get('/update-constipation-questions', function(req, res) {
  const sql = "SELECT id, text, speechid FROM `constipation_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `constipation_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});

app.get('/creatediarrhoeatable',(req, res) => {
    var sql = "Create TABLE diarrhoea_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(500), UNIQUE KEY unique_id (id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('diarrhoea question table working....')
    });
  });

app.get('/adddiarrhoeaquestions', (req, res) => {
    let questions = [
        ['diarrhoea','Have you been experiencing some diarrhoea?'],//grey
        ['diarrhoea_period','How long has this been a issue?'],//red
        ['diarrheoa_bowel_motion','How many bowel motions per day are you experiencing?'],//red
        ['still','Are you still experiencing diarrhoea?'],//green
        ['diarrhoea_blood','Have you noticed any blood associated with your bowel motions?'],//green
        ['diarrhoea_abdominal_pain', 'Have you been experiencing any abdominal pain or discomfort?'],//green
        ['abdominal_cramps', 'Have you been experiencing any associated abdominal cramps?'],//green
        ['diarrhoea_eating','Are you eating and drinking as you normally would?'],//green
        //['other_symp', 'Have you any other associated symptoms?']//grey
    ];

        let sql = 'INSERT INTO diarrhoea_question  (id, text) VALUES ?';
    db.query(sql, [questions], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('questions are added...');
    });
});

app.get('/update-diarrhoea-questions', function(req, res) {
  const sql = "SELECT id, text, speechid FROM `diarrhoea_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `diarrhoea_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});

app.get('/createabdominalatable',(req, res) => {
    var sql = "Create TABLE abdominal_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(500), UNIQUE KEY unique_id (id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('abdominal question table working....')
    });
  });

app.get('/addabdominalquestions', (req, res) => {
    let questions = [
        ['abdominal_pain', 'Have you been experiencing some abdominal pain or discomfort?'],//grey
        ['where', 'Where on your abdomen do you feel the abdominal pain or discomfort? Upper/lower/Side?'],//grey
        ['abdominal_pain_period', 'How long have you been experiencing this symptom?'],//red
        ['abdominal_pain_sudden', 'Was it sudden in onset or gradual?'],//green
        ['all_time', 'Do you feel pain or discomfort all of the time?'],//green
        ['deteriorate', 'Has the pain or discomfort deteriorated?'],//green
        ['severe', 'How severe is the pain or discomfort do you feel? between 1 to 10'],//red
        ['sharp', 'Is the pain or discomfort sharp or dull?'],//green
        ['bowel_motion', 'Are you passing bowel motions as you would normally?'],//green
        ['abdominal_pain_diarrhoea', 'Have you been experiencing any constipation or diarrhoea?'],//green
        ['urine', 'Are you passing urine as you would normally?'],//green
        ['abdominal_pain_eating','Are you eating/drinking as you would normally?'],//green
        ['abdominal_pain_heartburn','Are you experiencing any heartburn or reflux?'],//green
        //['other_symp', 'Have you any other associated symptoms?']//grey
    ];

        let sql = 'INSERT INTO abdominal_question  (id, text) VALUES ?';
    db.query(sql, [questions], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('questions are added...');
    });
});

app.get('/update-abdominal-questions', function(req, res) {
  const sql = "SELECT id, text, speechid FROM `abdominal_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `abdominal_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});

app.get('/createvomittable',(req, res) => {
    var sql = "Create TABLE vomit_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(500), UNIQUE KEY unique_id (id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('vomit question table working....')
    });
  });

app.get('/addvomitquestions', (req, res) => {
    let questions = [
        ['vomit', 'Have you been vomiting?'],//grey
        ['when', 'When did you start vomiting?'],//grey
        ['times', 'Did you vomit more than once?'],//grey
        ['continuing', 'Are you continuing to vomit?'],//grey
        ['blood', 'Have you vomited any blood?'],//grey
       // ['how_much', 'How much blood do you think you vomited?'],//grey
        ['vomit_eating','Are you eating/drinking as you would normally?'],//grey
        ['nauseous','Do you feel nauseous?'],//grey
        ['vomit_abdominal_pain', 'Have you been experiencing any abdominal pain or discomfort?'],//grey
        //['other_symp', 'Have you any other associated symptoms?']//grey
    ];

        let sql = 'INSERT INTO vomit_question  (id, text) VALUES ?';
    db.query(sql, [questions], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('questions are added...');
    });
});

app.get('/update-vomit-questions', function(req, res) {
  const sql = "SELECT id, text, speechid FROM `vomit_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `vomit_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});

app.get('/createheartburntable',(req, res) => {
    var sql = "Create TABLE heartburn_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(500), UNIQUE KEY unique_id (id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('heartburn question table working....')
    });
  });

app.get('/addheartburnquestions', (req, res) => {
    let questions = [
        ['heartburn', 'Do you experience heartburn or indigestion or reflux?'],//grey
        ['heartburn_period', 'How long has this been a problem?'],//grey
        ['heartburn_times', 'How often does it affect you?'],//grey
        ['deteriorate', 'Do you feel it has deteriorated?'],//grey
        //['other_symp', 'Have you any other associated symptoms?']//grey
    ];

        let sql = 'INSERT INTO heartburn_question  (id, text) VALUES ?';
    db.query(sql, [questions], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('questions are added...');
    });
});

app.get('/update-heartburn-questions', function(req, res) {
  const sql = "SELECT id, text, speechid FROM `heartburn_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `heartburn_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});




app.get('/createobjectivetable',(req, res) => {
  var sql = "Create TABLE objective_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(500), guide VARCHAR(500), UNIQUE KEY unique_id (id))";
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("table created" + result);
    res.send('objective question table working....')
  });
});

app.get('/addobquestions', (req, res) => {
  let questions = [
      ['spirometer', 'We would like to know what your lung function is, do you think you can check your lung function using your spirometer?', 'Yes or No'],
      ['spirometer_ready', 'Are you ready to check your lung function with me?', 'Yes or No'],
      // ['spirometer_yes', 'Please check your lung function 3 times as previously instructed and enter the best result now?', 'TODO'],
      ['spirometer_no', 'Please enter a reason for not completing spirometry (No equipment, Not well enough, Other)', 'No equipment, Not well enough, Other'],
      ['spirometer_location', 'Before you begin please check your surroundings. We advise you to find somewhere safe, secure and comfortable so that you won’t be disturbed and you can concentrate on your lung function assessment. Are you ready to progress with the procedure?', 'Yes or No'],
      ['spirometer_equipment', 'Let us double check you have everything you need. Please ensure you have your spirometer, a new blue filter and a nose clip if you use one. Please remove the blue filter from the plastic packaging and attach it to the spirometer. Now please turn on your spirometer. You may need to give the spirometer a moment or two to start up. You may need to replace the batteries in the device if it does not turn on. Would you like to continue in checking your lung function?', 'Yes or No'],
      ['spirometer_prepare', 'You are almost ready to check your lung function. Please take up whatever position, sitting or standing, you ordinarily would when checking your lung function. Take a moment to relax and prepare to blow. Please check the device is still turned on. The screen will show a picture of a head making a blowing movement. The device is ready when this is showing.', 'Yes or No'],
      ['nose_clip', 'Please place the nose clip on your nose if you ordinarily use one?', 'Yes or No'],
      ['ready', 'When you are ready, please perform an effort. Remember to inhale as deeply as you can, then with as little delay as possible form a good seal with your mouth around the mouthpiece and exhale as quickly and forcefully as you can. Remember your technique and what you have been instructed to do previously. Finally, remember, when checking your lung function using this device, you do not need to continue blowing. One or two seconds is plenty.', 'Yes or No'],
      ['complete', 'Effort complete?', 'Yes or No'],
      ['spirometer_fin', 'Well done. Take a moment to relax now that you have finished. Remove the nose clip and sit down for a moment to recover. Please note the reading on your device. Two different numbers will appear on the screen in an alternating manner. Please note the value in litres. It will likely be in the region of 1.0 to 5.0 litres. Write this down if you can as you will need to enter it shortly.', 'Yes or No'],
      ['spirometer_details', 'Please enter your lung function as it was displayed on the device and select “Next” to continue.', 'Yes or No'],
      ['spirometer_retake', 'Take a minute or two before you perform your next effort. Select “Next Blow” to perform your next effort or “Spirometry complete” if you have completed a minimum of three blows and want to move onto checking your oxygen levels.', 'Yes or No'],
      ['oxygen', 'We would like to know what your oxygen saturations are, do you think you can check your oxygen saturations using your finger probe pulse oximeter?', 'Yes or No'],
      ['oxygen_no', 'Please enter a reason for not checking your oxygen saturations. (No equipment, Not well enough, Other)', 'No equipment, Not well enough, Other'],
      // ['oxygen_yes', 'Please check your percentage oxygen saturation using your finger probe pulse oximeter and enter your percentage oxygen saturation', 'TODO'],
      ['oxygen_location', 'Before you begin please check your surroundings. We advise you to find somewhere safe, secure and comfortable so that you won’t be disturbed and you can concentrate on your oxygen saturation assessment.', 'TODO'],
      ['oxygen_equipment', 'Please check you have your finger tip pulse oximeter with you. Please turn on your pulse oximeter as previously instructed. If it does not turn on, please check the batteries and replace them if needed. Please allow a few moments for the pulse oximeter to stabilise.', 'TODO'],
      ['oxygen_prepare', 'Prepare to check your oxygen saturation. Please take a few moments and sit quietly. Allow yourself to catch your breath and allow your breathing to relax. Take a few deep breaths if you need. Please ensure your hands are clean and dry. You will need to ensure your nails are clean and free from varnish or other materials.', 'TODO'],
      ['oxygen_ready', 'When you are comfortable and ready, please place the pulse oximeter securely on one of your index fingers. Please allow a few moments before checking the reading. Please note this may take a few moments. Please write down the value. If you are not getting a reading you may need to try a different finger.', 'TODO'],
      ['oxygen_details', 'Please enter your lung function as it was displayed on the device and select “Next” to continue.', 'TODO'],
      ['oxygen_retake', 'Take a minute or two before you perform your next effort. Select “Next Blow” to perform your next effort or “Spirometry complete” if you have completed a minimum of three blows and want to move onto checking your oxygen levels.', 'TODO'],
      ['temperature', 'We would like to know what your body temperature is, do you think you can check your temperature using your thermometer?', 'Yes or No'],
      ['temperature_ready', 'Are you ready to check your temperature? ', 'TODO'],
      ['temperature_location', 'Before you begin please check your surroundings. We advise you to find somewhere safe, secure and comfortable so that you won’t be disturbed and you can concentrate on your temperature measurement.', 'TODO'],
      ['temperature_equipment', 'Please check you have your infrared thermometer with you. Please turn on your thermometer as previously instructed. If it does not turn on, please check the batteries and replace them if needed. Please allow a few moments for the thermometer to stabilise.', 'TODO'],
      ['temperature_prepare', 'Prepare to check your temperature. Please take a few moments and sit quietly. Please remove and headware such as hats. Please ensure your forehead is dry. Please ensure your hair is pushed back off your forehead.', 'TODO'],
      ['temperature_comfortable', 'When you are comfortable and ready, please check your temperature by holding the thermometer close to your forehead and pressing the button. The thermometer should beep when it has read your temperature. Please write down the value. If you are not getting a reading you may need to repeat the process.', 'TODO'],
      ['temperature_details', 'Please input your temperature value and select “Next” to continue.', 'TODO'],
      ['temperature_retake', 'Please select “Temperature assessment complete” to move on and complete your assessments or “Repeat Temperature assessment” if you need to repeat the measurement or re-enter your result.', 'TODO'],
      ['temperature_no', 'Please enter a reason for not checking your temperature.(No equipment, Not well enough, Other)', 'No equipment, Not well enough, Other']
  ];

  let sql = 'INSERT INTO objective_question  (id, text, guide) VALUES ?';
  db.query(sql, [questions], (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('questions are added...');
  });
});

app.get('/update-ob-questions', function(req, res) {
  const sql = "SELECT id, text, speechid FROM `objective_question`";
  db.query(sql, function(err, result) {
      if(err) throw err;
      result.forEach(row => {
          var fileId = crypto.createHash("md5").update(row.text).digest("hex");
          db.query("UPDATE `objective_question` SET speechid = ? WHERE id = ?", [fileId, row.id], function(err, result) {
              if(err) throw err;
              console.log(row);
              console.log("1 record updated");
              // res.end();
          });
      })
      res.end(JSON.stringify(result));
  });
});


};