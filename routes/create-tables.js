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

// create the patients baseline tables 

  app.get('/createchesttable',(req, res) => {
    var sql = "CREATE TABLE baseline_chest (chest_id INT NOT NULL AUTO_INCREMENT, patient_id INT, cough VARCHAR(255), shortness_of_breath VARCHAR(255), sputum_baseline_volume VARCHAR(255), sputum_baseline_colour VARCHAR(255), sputum_baseline_consistency VARCHAR(255), chest_discomfort VARCHAR(255), chest_tightness VARCHAR(255), blood_in_sputum VARCHAR(255), fever VARCHAR(255), baseline_score VARCHAR(255), PRIMARY KEY(chest_id),FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" chest table created" + result);
      res.send('chest table working....')
    });
  });

  app.get('/addresults', (req, res) => {
    let cough = [
        ['occasional, cough, dry, mild', 'occasional, on exertion', 'little', 'clear', 'normal', 'never', 'never', 'never', 'never'],
        ['frequent, productive', 'occasional, on exertion', 'little', 'green/yellow', 'normal', 'never', 'occasioanl', 'never','never'],
        ['occasional, cough, dry, mild','occasional, on exertion', 'little', 'normal','normal', 'never', 'never', 'never', 'never'],
        ['frequent, productive','occasional, on exertion', '60ml', 'dark green', 'normal', 'never', 'never', 'frequent', 'never'],
        ['frequent, productive', 'occasional, on exertion', 'little 10 or 15ml', 'light green/clear', 'normal', 'never', 'occasional', 'never', 'never'],
        ['frequent, productive', 'occasional', 'little 15ml', 'clear', 'normal', 'never', 'occasional', 'never', 'never'],
        ['frequent, productive','never', 'little', 'clear/yellow', 'normal', 'never', 'never', 'never', 'never'],
        ['frequent, productive', 'never', 'little', 'yellow', 'normal', 'never', 'never', 'never', 'never'],
        ['never', 'never', 'none', 'n/a', 'n/a', 'none', 'none', 'none', 'none'],
        ['frequent, productive', 'occasional', 'little 20ml', 'clear/green', 'normal', 'none', 'none', 'none', 'none']
    ];
    let sql = 'INSERT INTO chest (cough, shortness_of_breath, sputum_baseline_volume, sputum_baseline_colour, sputum_baseline_consistency, chest_discomfort, chest_tightness, blood_in_sputum, fever ) VALUES ?';
    db.query(sql, [cough], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('cough results added...');
    });
});

  app.get('/createsinustable',(req, res) => {
    var sql = "CREATE TABLE baseline_sinus (patient_id INT NOT NULL AUTO_INCREMENT, congestion VARCHAR(255), post_nasal_drip VARCHAR(255), facial_pain VARCHAR(255), headache VARCHAR(255), cough VARCHAR(255), baseline_score INT, FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" sinus table created" + result);
      res.send('sinus table working....')
    });
  });

  app.get('/addsinusresults', (req, res) => {
    let sinus = [
        ['frequent', 'occasional', 'never', 'occasional', 'no', 4],
        ['never', 'occasional', 'never', 'never', 'no', 2],
        ['never','occasional', 'never', 'occasioanl','no', 3],
        ['never','never', 'never', 'never', 'no', 0],
        ['never', 'never', 'never', 'never', 'no', 0],
        ['occasional', 'occasional', 'never', 'never', 'no', 3],
        ['never', 'never', 'never', 'never', 'no', 0],
        ['never', 'never', 'never', 'never', 'no', 0],
        ['never', 'never', 'never', 'never', 'no', 0],
        ['never', 'never', 'never', 'never', 'no', 0]
    ];
    let sql = 'INSERT INTO baseline_sinus (congestion, post_nasal_drip, facial_pain, headache, cough, baseline_score) VALUES ?';
    db.query(sql, [sinus], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('sinus results added...');
    });
}); 

  app.get('/creategitable',(req, res) => {
    var sql = "CREATE TABLE gi (gi_id INT NOT NULL AUTO_INCREMENT, patient_id INT,  abdominal_discomfort VARCHAR(255), abdominal_cramps VARCHAR(255), constipation VARCHAR(255), bloating VARCHAR(255), diarrhea VARCHAR(255), nausea VARCHAR(255), vomitting VARCHAR(255), stool_consistency VARCHAR(255), haemorroids VARCHAR(255), toilet_frequency VARCHAR(255), PRIMARY KEY(gi_id), FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" gi table created" + result);
      res.send('gi table working....')
    });
  });

  app.get('/addgiresults', (req, res) => {
    let gi = [
        ['never','never', 'never', 'never', 'never', 'never', 'never', 'normal', 'no', '>1'],
        ['never', 'never', 'never', 'never', 'occasional', 'never', 'never', 'normal', 'no', '>1'],
        ['occasional','occasional','never', 'never', 'never', 'never','never','normal', 'no','>1'],
        ['never','never','never', 'never', 'never', 'never', 'never', 'normal', 'no', '>1'],
        ['never','never', 'never', 'never', 'never', 'never', 'never', 'normal', 'no', '>1'],
        ['never','occasional','occasional', 'occasional', 'never', 'never', 'never', 'hard', 'yes?', '>1'],
        ['never', 'never','never', 'never', 'never', 'never', 'never','normal','no', '>1'],
        ['never','never', 'never', 'never', 'never', 'never', 'never','normal','no', '>1'],
        ['occasional','occasional', 'occasional','occasional', 'never', 'never', 'never', 'hard', 'no', '>1'],
        ['never','never', 'never', 'never', 'never', 'never', 'never','normal','no', '>1']
    ];
    let sql = 'INSERT INTO gi (abdominal_discomfort, abdominal_cramps, constipation, bloating, diarrhea, nausea, vomitting, stool_consistency, haemorroids, toilet_frequency) VALUES ?';
    db.query(sql, [gi], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('gi results added...');
    });
});


  app.get('/createothertable',(req, res) => {
    var sql = "CREATE TABLE other (other_id INT NOT NULL AUTO_INCREMENT, patient_id INT, sleeping VARCHAR(255), eating_appetite VARCHAR(255), drinking VARCHAR(255), medication_compliance VARCHAR(255), exercise VARCHAR(255), airway_clearance VARCHAR(255), PRIMARY KEY(other_id), FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" other table created" + result);
      res.send('other table working....')
    });
  });

  app.get('/addotherresults', (req, res) => {
    let other = [
        ['normal','normal', 'normal', 'good', 'no exercise', 'sometimes'],
        ['normal', 'poor appetite', 'normal', 'good', 'no exercise', 'sometimes'],
        ['normal','normal','normal', 'good', 'very good', 'all of the time'],
        ['normal','normal','normal', 'good', 'good', 'regularly'],
        ['normal','normal','normal', 'very good', 'good', 'regularly'],
        ['normal','normal','normal', 'good', 'good', 'regularly'],
        ['normal','normal','normal', 'good', 'good', 'regularly'],
        ['normal','normal','normal', 'good', 'very good', 'regularly'],
        ['normal','normal','normal', 'good', 'good', 'regularly'],
        ['normal','normal','normal', 'good', 'poor', 'Infrequent']
    ];
    let sql = 'INSERT INTO other (sleeping, eating_appetite, drinking, medication_compliance, exercise, airway_clearance) VALUES ?';
    db.query(sql, [other], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('other results added...');
    });
});

app.get('/getother', (req, res) => {
    let sql = 'SELECT * FROM other';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send('other fetched...');
    });
});

//create tables to be updated with patients responses

app.get('/createupdatechesttable',(req, res) => {
    var sql = "CREATE TABLE updatechest (patient_id INT, cough VARCHAR(255), shortness_of_breath VARCHAR(255), sputum_baseline_volume VARCHAR(255), sputum_baseline_colour VARCHAR(255), sputum_baseline_consistency VARCHAR(255), chest_discomfort VARCHAR(255), chest_tightness VARCHAR(255), blood_in_sputum VARCHAR(255), fever VARCHAR(255), baseline_score VARCHAR(255) ,FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" uppdate chest table created" + result);
      res.send('update chest table working....')
    });
  });

  app.get('/createupdatesinustable',(req, res) => {
    var sql = "CREATE TABLE updatesinus (patient_id INT, period VARCHAR(255), congestion VARCHAR(255), post_nasal_drip VARCHAR(255), facial_pain VARCHAR(255), headache VARCHAR(255), cough VARCHAR(255), add_treatment VARCHAR(255), other_symp VARCHAR(255),  basescore_result INT(10), comparative_score INT(10), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" update sinus table created" + result);
      res.send('update sinus table working....')
    });
  });

  app.get('/createUpdateConstipationTable',(req, res) => {
    var sql = "Create TABLE updateconstipation (patient_id INT, constipation VARCHAR(255), constipation_period VARCHAR(255), constipation_bowel_motion VARCHAR(255), previous VARCHAR(255), constipation_abdominal_pain VARCHAR(255), bloated VARCHAR(255), passing_wind VARCHAR(255), constipation_eating VARCHAR(255), other_symp VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("table created" + result);
      res.send('constipation update table working....')
    });
  });

  

  app.get('/createupadteothertable',(req, res) => {
    var sql = "CREATE TABLE updateother (patient_id INT, sleeping VARCHAR(255), eating_appetite VARCHAR(255), drinking VARCHAR(255), medication_compliance VARCHAR(255), exercise VARCHAR(255), airway_clearance VARCHAR(255), FOREIGN KEY (patient_id) REFERENCES patients(patient_id))";
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
  var sql = "Create TABLE end_question (_id INT AUTO_INCREMENT PRIMARY KEY, id VARCHAR(255) NOT NULL, text VARCHAR(500), speechid VARCHAR(255), UNIQUE KEY unique_id (id))";
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("table created" + result);
    res.send('end question table working....')
  });
});

app.get('/addEndquestions', (req, res) => {
  let questions = [
      ['end_sinus', 'Do you feel you have any other issue with chest pain or gastrointestinal?'],//red
      ['end_chest', 'Do you feel you have any other issue with your sinuses or gastrointestinal?'],//green
      ['end_gas', 'Do you feel you have any other issue with your sinuses or chest pain?'],
      ['end_chest_branches', 'Are you having any other issues with your chest?'],
      ['end_gas_barnches', 'Are you having any other gastrointestinal problems?'],//green
  ];
  let sql = 'INSERT INTO end_question (id, text) VALUES ?';
  db.query(sql, [questions], (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('questions are added...');
  });
}); 

app.get('/update-end-questions', function(req, res) {
  const sql = "SELECT  id, text, speechid FROM `end_question`";
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
};