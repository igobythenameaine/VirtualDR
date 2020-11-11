//send email to MDT code sourced from https://nodemailer.com/about/

module.exports = function (app, fs, nodemailer, db) {
app.post('/send-mail/', function(req, res) {

    // db.query ("SELECT updatesinus.patient_id, updatesinus.basescore_result as 'newScore',baseline_sinus.baseline_score as 'baselineScore', updatesinus.basescore_result-baseline_sinus.baseline_score as 'comparativeScore' from updatesinus LEFT JOIN baseline_sinus ON updatesinus.patient_id = baseline_sinus.patient_id ;", function(err, result, feilds){
    // if(err) throw err;
    // //console.log(result);
    // //var base = Object.values(JSON.parse(JSON.stringify(result)));
    // var base = JSON.parse(JSON.stringify(result));
    // console.log('will this do ', base);
    // });


    let transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com', 
        port:587,
        secure: false,
        auth: {
            user: 'vdrproject@outlook.com', 
            pass: 'Projectpass'
        },
        tls:{
            rejectUnauthorized:false
          }
        });
        

            fs.readFile('/reports/transcript.csv', function (err, data) {
                let mailOptions = {
                    from: 'vdrproject@outlook.com',
                    to: '118224339@umail.ucc.ie',
                    subject: 'Results from virtual Dr',
                    text: 'Here are the results from a patients visit to the virual Dr.',
                    attachments: [
                        {
                            path: __dirname + '/reports/transcript.csv'
                        }
                    ]
                };
            
                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);   
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
            });
        });

};

