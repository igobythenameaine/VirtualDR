//code sourced from https://www.sitepoint.com/experimenting-web-speech-api/
//speech recognistion with promise

app.service("speechService", function () {
      
let p = document.createElement("p");//adding paragraph element
var words = document.querySelector(".words");//taking words div and appending the p's
words.appendChild(p);

    this.start = function(grammar) {
 
        return new Promise(function(resolve, reject) {
            var SpeechRecognition = SpeechRecognition        ||
                                    webkitSpeechRecognition  ||
                                    null;

            if (SpeechRecognition === null) {
                reject('API not supported');
            }

            var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
            var recognizer = new SpeechRecognition();
            var speechRecognitionList = new SpeechGrammarList();
            if (grammar) {
                speechRecognitionList.addFromString(grammar, 1);
            }

            recognizer.grammars = speechRecognitionList;
            recognizer.lang = 'en-US';
            recognizer.interimResults = false;
            recognizer.maxAlternatives = 1;

            recognizer.addEventListener('result', function (event) {
                console.log('Recognition completed');
                        resolve(event.results[0][0].transcript);
                        console.log('Confidence: ' + event.results[0][0].transcript);
                        p.textContent = event.results[0][0].transcript
            });

            recognizer.addEventListener('error', function (event) {
                console.log('Recognition error');
                document.getElementById("mic").style.visibility = "hidden";
                reject('An error has occurred while recognizing: ' + event.error);
            });

            recognizer.addEventListener('nomatch', function (event) {
                console.log('Recognition ended because of nomatch');
                document.getElementById("mic").style.visibility = "hidden";
                reject('Error: sorry but I could not find a match');
            });

            recognizer.addEventListener('end', function (event) {
                console.log('Recognition ended');
                document.getElementById("mic").style.visibility = "hidden";
                reject('Error: sorry but I could not recognize your speech');
            });

            console.log('Recognition started');
            recognizer.start();
        });
    }
});