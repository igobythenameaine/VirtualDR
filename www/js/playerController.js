
app.controller("playerController",
 ['$scope','recordService','textFileService','sendFileService','questionGiService','questionChestService', 'questionSinusService', 'questionEndService', 'patientService', 'speechService', 'sceneService', 'avatarService', 'scriptService','accountService', 
 function ($scope, recordService, textFileService, sendFileService, questionGiService, questionChestService, questionSinusService, questionEndService, patientService, speechService, sceneService, avatarService, scriptService, accountService) {
    console.log("Initialising PC");
    
    const names = ['John', 'Paul', 'Sarah']; 
    let sinusScore = 0;
    let chestScore = 0;
    let giScore = 0;

    let chestQuestions;
    let chestQuestionKeys;

    let endQuestions;
    let endQuestionKeys;

    let sinusQuestions;
    let sinusQuestionKeys;

    let giQuestions;
    let giQuestionKeys;
    
    let accounts;

    let patientId;

    var sinuses = {};
    var end = {};
    var gi = {};
    var chest = {};

    $scope.data = {};
    $scope.data.subtitles = " ";
    $scope.data.line = {};
   

    $scope.start = "This aplication is going to ask a number of question about your health most of the required answers will be indicated in this panel.Questions will be spoken or can be read in the 'doctor says' panel.This application records the conversation for training purposes If you wish to proceed press the start recording button"
    $scope.showStart = true;
    
    $scope.firstReason = "Chest pain"
    $scope.secondReason = "Sinuses"
    $scope.thirdReason = "Gastrointestinal"
    $scope.otherReason = "Other"
    $scope.noReason = "No"

   
    $scope.firstTime = "24 hours"
    $scope.secondTime = "Less than a week"
    $scope.thirdTime = "More than a week"
  


    $scope.lookingAt = "default";

    var self = this;
    var webGL;
    self.tweens = [];

            
    window.addEventListener("mousemove", onmousemove, false);
  
    //condition pattern for keywords
    var conditionsTwo = /\bno\b|\bnope\b|\bI don't think so\b|\bI doubt it\b|\bI would not think do\b|\b I would not say so\b|\bI am not bad\b|\bI don't\b|\bNo problem\b|\bit's not a problem\b|\bit's not an issue\b/;
    var conditionsOne = /\byes\b|\byeah\b|\byup\b|\byep\b|\bI have\b|\bI do\b|\bcertainly\b|\bdefinitely\b|\bI think so\b|\bI would say so\b|\bfor sure\b/;

    function WebGL() {
        var self = this;
        var ToRad = Math.PI / 180;

        function Orbit(origin, horizontal, vertical, distance) {
            var p = new THREE.Vector3();
            var phi = vertical * ToRad;
            var theta = horizontal * ToRad;
            p.x = (distance * Math.sin(phi) * Math.cos(theta)) + origin.x;
            p.z = (distance * Math.sin(phi) * Math.sin(theta)) + origin.z;
            p.y = (distance * Math.cos(phi)) + origin.y;
            return p;
        }

        self.setCamera = function () {
            self.camera.position.copy(Orbit(self.cameraTarget, self.camPos.horizontal, self.camPos.vertical, self.camPos.distance));
            self.camera.lookAt(self.cameraTarget);
        }

        function setup() {

            self.container = document.getElementById("scene");

            self.vsize = {};
            self.vsize.x = self.container.getBoundingClientRect().width;
            self.vsize.y = self.container.getBoundingClientRect().height;

            self.vsize.z = self.vsize.x / self.vsize.y;

            self.scene = new THREE.Scene();

            // CAMERA
            self.camera = new THREE.PerspectiveCamera(45, self.vsize.z, 1, 500);
            self.camera.scale.set(1, 1, 1);
            self.camPos = { horizontal: 90, vertical: 84, distance: sceneService.room.depth / 2, automove: false };
            self.center = new THREE.Vector3(sceneService.room.width / 2, 1.2, - sceneService.room.depth / 2);

            self.cameraTarget = self.center.clone();
            self.setCamera();

            // RENDERER
            self.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            self.renderer.setSize(self.vsize.x, self.vsize.y);
            self.renderer.domElement.style.zIndex = 1;
            self.container.appendChild(self.renderer.domElement);

        }

        setup();

        return this;
    }

    function animate() {
        requestAnimationFrame(animate);
        transition();
        webGL.renderer.render(webGL.scene, webGL.camera);
    }

    async function initialise() {

        //get all sinus questions from database

        sinusQuestions = await questionSinusService.getAll();
        sinusQuestionKeys = Object.keys(sinusQuestions);

        console.log(sinusQuestions, sinusQuestionKeys);

        giQuestions = await questionGiService.getAll();
        giQuestionKeys = Object.keys(giQuestions);
        console.log(giQuestions, giQuestionKeys);
        // get patient id from cookie
        const patientIdCookie = document.cookie.split(';').find(cookie => cookie.startsWith('patientId')); 
        patientId = patientIdCookie.split('=')[1];

        accounts = await accountService.getPatient(patientId);
        console.log(accounts);

        chestQuestions = await questionChestService.getAll();
        chestQuestionKeys = Object.keys(chestQuestions);
        console.log(chestQuestions, chestQuestionKeys);

        endQuestions = await questionEndService.getAll();
        endQuestionKeys = Object.keys(endQuestions);

        console.log(endQuestions, endQuestionKeys);

        document.getElementById("startUp").style.visibility = "visible"; 

        document.getElementById("mic").style.visibility = "hidden";
        //document.getElementById("reasonBtns").style.visibility = "hidden";
       // document.getElementById("chestReasons").style.visibility = "hidden";
        document.getElementById("gasReasons").style.visibility = "hidden";
        // document.getElementById("timeBtns").style.visibility = "hidden";
        // document.getElementById("YNBtns").style.visibility = "hidden";
        document.getElementById("bowlMovement").style.visibility = "hidden";
        document.getElementById("mild").style.visibility = "hidden";
        document.getElementById("moderate").style.visibility = "hidden";
        document.getElementById("severe").style.visibility = "hidden";
        document.getElementById("urgent").style.visibility = "hidden";
      //  document.getElementById("DocAn").style.visibility = "hidden";

        scene = new THREE.Scene();
        webGL = new WebGL();
       
        sceneService.addScene(webGL, sceneService.office);
        sceneService.addLights(webGL);

         avatarService.headLoader(webGL, function (d) {
            webGL.avatar = d;
            webGL.avatar.head.position.set(sceneService.room.width / 2, 0.8, -(sceneService.room.depth/2.5)); 
            animate();
            setTimeout(blink, 4000);
            setTimeout(eyes, 2000);
        });
    
        //create function for text input by user
        $scope.getTextInput = function (){
            
            let p = document.createElement("p");//adding paragraph element
            var textarea = document.getElementById("textBox").value;
            p.textContent = textarea;
            if(/\bJohn\b/.test(textarea)) {
                console.log('correct match!', textarea );
                $scope.moveToNextItem("John");
            }

        }
    }
    
    function eyes() {
        var ampZ = ((Math.random() * 1) - 0.5) / 20;
        var dur = Math.random() * 50 + 50;
        var animations =
            {
                current: 0,
                steps: [
                    {
                        animations: [
                            { name: "eyesZ", from: webGL.avatar.eyeGeoL.rotation.z, to: webGL.avatar.eyeGeoL.rotation.z + ampZ, duration: dur },
                        ],
                    }
                ]
            };
        var st = 0;
        for (var i = 0; i < animations.steps.length; i++) {
            animations.steps[i].animations[0].time = st;
            st = st + animations.steps[i].animations[0].duration;
        }
        self.tweens.push(animations);
        setTimeout(eyes, Math.random() * 1000 + 200);
    }

    function blink() {
        var animations =
            {
                current: 0,
                steps: [
                    {
                        animations: [{ name: "blinkRight", from: 0, to: 1, time: 0, duration: 100 },
                        { name: "blinkLeft", from: 0, to: 1, time: 0, duration: 100 }]
                    },
                    {
                        animations: [{ name: "blinkRight", from: 1, to: 0, time: 100, duration: 100 },
                        { name: "blinkLeft", from: 1, to: 0, time: 100, duration: 100 }]
                    }
                ]

            };
        self.tweens.push(animations);
        setTimeout(blink, Math.random() * 5000 + 2000);
    }

    function setSceneProperty(name, value) {
        if ((name != "eyesX") && (name != "eyesZ")) {
            webGL.avatar.head.setWeight(name, value);
            webGL.avatar.teethUpper.setWeight(name, value);
            webGL.avatar.teethLower.setWeight(name, value);
            webGL.avatar.tongue.setWeight(name, value);
            webGL.avatar.throat.setWeight(name, value);
        } else if (name == "eyesX") {
            webGL.avatar.eyeGeoR.rotation.x = value;
            webGL.avatar.eyeGeoL.rotation.x = value;
        } else if (name == "eyesZ") {
            webGL.avatar.eyeGeoR.rotation.z = value;
            webGL.avatar.eyeGeoL.rotation.z = value;
        }
    }

    function buildSpeechTweens(visemes) {
        var max = 0.5;
        var tweens = [];
        var lastTime = 0;
        for (var i = 0; i < visemes.length; i++) {
            var tween = {
                animations: [{ name: visemes[i].phoneme, from: 0, to: max, time: visemes[i].time, duration: visemes[i].duration }]
            };
            if (i > 0) {
                tween.animations.push({
                    name: visemes[i - 1].phoneme,
                    from: max,
                    to: 0,
                    time: visemes[i].time,
                    duration: visemes[i - 1].duration / 3
                })
            };
            tweens.push(tween);
        }
        var tween = {
            animations: [{ name: visemes[i - 1].phoneme, from: max, to: 0, time: visemes[i - 1].time + visemes[i - 1].duration, duration: visemes[i - 1].duration / 2 }]
        };
        tweens.push(tween);
        self.tweens.push({ current: -1, steps: tweens, type: "speech" });
    }

    function transition() {
        for (var i = self.tweens.length - 1; i >= 0; i--) {
            if (self.tweens[i].steps[self.tweens[i].current] != undefined) {
                transitionTween(i);
            } else {
                if ((self.tweens[i].finished)) {
                    self.tweens.splice(i, 1);
                }
            }
        }
    }

    function transitionTween(idx) {
        if (self.tweens[idx].steps[self.tweens[idx].current] == undefined) {
            return;
        }
        var tween = self.tweens[idx].steps[self.tweens[idx].current];

        if (self.tweens[idx].baseTime == undefined) {
            self.tweens[idx].baseTime = performance.now();
        }

        if (tween.start == undefined) {
            tween.start = self.tweens[idx].baseTime + tween.animations[0].time;
            for (var i = 0; i < tween.animations.length; i++) {
                tween.animations[i].delta = (tween.animations[i].to - tween.animations[i].from) / tween.animations[i].duration;
            }
        } 

        var pn = performance.now();
        var dur = pn - tween.start;
        for (var i = tween.animations.length - 1; i >= 0; i--) {
            var value = tween.animations[i].from + (dur * tween.animations[i].delta);
            if (tween.animations[i].delta > 0) {
                if (value >= tween.animations[i].to) {
                    value = tween.animations[i].to;
                } else if (value <= tween.animations[i].from) {
                    value = tween.animations[i].from
                }
            }
            else {
                if (value <= tween.animations[i].to) {
                    value = tween.animations[i].to;
                } else if (value >= tween.animations[i].from) {
                    value = tween.animations[i].from
                }
            }
            setSceneProperty(tween.animations[i].name, value);
        }

        if (dur > tween.animations[0].duration) {
            self.tweens[idx].current++;
            if (self.tweens[idx].current >= self.tweens[idx].steps.length) {
                self.tweens[idx].finished = true;
                if (self.tweens[idx].type == "speech") {
                    $scope.finishedTalking();
                }
            }
        }
    }

//...................start the interaction with avatar............  

    function getNames(str) {

        const name = names.find(function(name){
            const patt = new RegExp(name, "i");
            return patt.test(str);
        });
        if (name){
            console.log('I heard the correct phrase!', str );
            $scope.moveToNextItem(name);   
        }else{
            console.log('That didn\'t sound right.');
            $scope.moveToNextItem("noMatch");
        }

    
    }

//.........get reasons...........//

    function getReasons(str) {

        document.getElementById("reasonBtns").style.visibility = "hidden";
        
        const reasons = ['sinuses', 'chest pain', 'gastrointestinal', 'other', 'no'];


        const reason = reasons.find(function(reason){
            const patt = new RegExp(reason, "i");
            return patt.test(str);
        });
        if (reason){
            console.log('I heard the correct phrase!', str );
            $scope.moveToNextItem(reason); 
            $scope.showReason = false;
        }else{
            console.log('That didn\'t sound right.');
            $scope.moveToNextItem("noReasonMatch");
        }
    }

    

    function getChestReasons(str) { //grey

        const chestReasons = ['cough', 'shortness of breath', 'blood in sputum', 'chest discomfort', 'additional', 'next'];

        const chestReason = chestReasons.find(function(chestReason){
            const patt = new RegExp(chestReason, "i");
            return patt.test(str);
        });
        if (chestReason){
            console.log('I heard the correct phrase!', str );
            $scope.moveToNextItem(chestReason)
        }else{
            console.log('That didn\'t sound right.');
            $scope.moveToNextItem("noChestMatch");
        }
    }
    
    function getGiReasons(str) { //grey

        document.getElementById("gasReasons").style.visibility = "hidden";

        const giReasons = ['constipation', 'diarrhoea', 'abdominal pain', 'vomiting', 'heartburn', 'not'];

        const giReason = giReasons.find(function(giReason){
            const patt = new RegExp(giReason, "i");
            return patt.test(str);
        });
        if (giReason){
            console.log('I heard the correct phrase!', str );
            $scope.moveToNextItem(giReason);
        }else{
            console.log('That didn\'t sound right.');
            $scope.moveToNextItem("noGiMatch");
        }
    }

//////////////////CHEST///////////////////////////////

function getChestNoIncrementAnswer(str, key) { //green
    if(conditionsOne.test(str)) {
        chest[key] = 'yes';
        console.log('I heard the correct phrase!', str );
        console.log("the score is " + chestScore);
    } else if(conditionsTwo.test(str)){
        chest[key] = 'no';
        chestScore++;
        console.log('I heard the correct phrase!', str );
        console.log("the score is " + chestScore);
    }else{
        console.log('That didn\'t sound right.');
        throw new Error('noMatch');
    }
}

function getChestYesNoAnswer(str, key) { //green
    if(conditionsOne.test(str)) {
        chest[key] = 'yes';
        chestScore++;
        console.log("the score is " + chestScore);
        console.log('I heard the correct phrase!', str );
    } else if(conditionsTwo.test(str)){
        chest[key] = 'no';
        console.log('I heard the correct phrase!', str );
    }else{
        console.log('That didn\'t sound right.');
        throw new Error('noMatch');
    }
}

function getChestPeriodAnswers(str, key) { //red
    console.log('get period answers');
    var mild = /\bless than a day\b|\b24-hours\b|\bless than 24-hours\b/;
    var moderate = /\bless than 7 days\b|\bless than 7-days\b|\bless than a week\b|\bcouple of days\b/;
    var severe = /\bmore than 7 days\b|\bmore than 7-days\b|\bmore than a week\b|\bover a week\b/;

        if(mild.test(str)) {
             console.log('I heard the correct phrase!', str );
        }else if(moderate.test(str)) {
            chestScore++;
            console.log("the score is " + chestScore);
            console.log('I heard the correct phrase!', str );
        }else if(severe.test(str)) {
            chestScore+=2;
            console.log("the score is " + chestScore);
            console.log('I heard the correct phrase!', str );
        }else{
            throw new Error('noMatch');
        }

        return true;
}
//......cough questions functions..................

    function getDifColour(str) { //red

        var mild = /\bclear\b|\bcolourless\b|\bcreamy\b/;
        var moderate = /\bgreen\b|\byellow\b|\bGreen\b|\bpurulent\b/;
        var severe = /\bbrown\b|\bdark\b|\bBrown\b|\bdirty\b|\bblood\b|\bhorrible\b|\bdisgusting\b/;

            if(mild.test(str)) {
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                console.log('I heard the correct phrase!', str );
                chestScore++;
                console.log("the chestScore is " + chestScore);
            }else if(severe.test(str)) {
                console.log('I heard the correct phrase!', str );
                chestScore+=2;
                console.log("the chestScore is " + chestScore);
            }else{
                throw new Error('noMatch');
        
            }
    }

    function getAmount(str) { //red
        var mild = /\bnone\b|\blittle\b|\bsmall amount\b|\ba mounth full\b|\bless than a mounth full\b|\bnormal\b/;
        var moderate = /\bmouthfuls\b|\bmore than normal\b/;
        var severe = /\bloads\b|\blots\b|\balot\b|\ban awful lot\b|\btonnes\b|\bheaps\b|\balot more than normal\b|\bway than normal\b/;

            if(mild.test(str)) {
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                console.log('I heard the correct phrase!', str );
                chestScore++;
                console.log("the chestScore is " + chestScore);   
            }else if(severe.test(str)) {
                console.log('I heard the correct phrase!', str );
                chestScore+=2;
                console.log("the chestScore is " + chestScore);
              
            }else{
                throw new Error('noMatch');
               
            }
    }
  
    function getBetter(str) { //red

        var mild = /\bbetter\b/;
        var moderate = /\bworse\b/;
        var severe = /\bsame\b/;

            if(mild.test(str)) {
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                console.log('I heard the correct phrase!', str );
                chestScore++;
                console.log("the chestScore is " + chestScore);
            }else if(severe.test(str)) {
                console.log('I heard the correct phrase!', str );
                chestScore+=2;
                console.log("the chestScore is " + chestScore);
            }else{
                throw new Error('noMatch');
        
            }
    }
//..............short of breath questions functions...........  
function getChestSuddenGradual(str) { //red

    var mild = /\bgradual\b|\bgradually\b|\bslowly\b/;
    var moderate = /\bsudden\b|\bsuddenly\b|\bout of the blue\b|\binstantly\b/;
   // var severe = /\bside\b|\bover\b/;

        if(mild.test(str)) {
            console.log('I heard the correct phrase!', str );
        }else if(moderate.test(str)) {
            chestScore++;
            console.log('I heard the correct phrase!', str );
            console.log("the score is " + chestScore);
        }else{
            console.log('That didn\'t sound right.');
            throw 'noMatch';
        }
}

    function getMildSevere(str) { //red

        var mild = /\bmild\b|\bmildly\b|\ba little\b|\ba small bit\b/;
        var moderate = /\bmoderate\b|\bmoderately\b|\ba bit\b/;
        var severe = /\bseverely\b|\ba lot\b|\bbad\b|\bsevere\b/;

            if(mild.test(str)) {
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                console.log('I heard the correct phrase!', str );
                chestScore++;
                console.log("the chestScore is " + chestScore);
            }else if(severe.test(str)) {
                console.log('I heard the correct phrase!', str );
                chestScore+=2;
                console.log("the chestScore is " + chestScore);
            }else{
                throw new Error('noMatch');
            }
    }
//.............blood......................

    function getRedFlagAnswer(str, key) { //green
        if(conditionsOne.test(str)) {
            chest[key] = 'yes';
            chestScore+=100;
            console.log("the score is " + chestScore);
            console.log('I heard the correct phrase!', str );
        } else if(conditionsTwo.test(str)){
            chest[key] = 'no';
            console.log('I heard the correct phrase!', str );
        }else{
            console.log('That didn\'t sound right.');
            throw new Error('noMatch');
        }
    }

    function getHowManyTimes(str) { //red

        var mild = /\bonce\b|\brarley\b|\bodd time\b/;
        var moderate = /\ba couple of times\b|\ba few times\b|\bmore than once\b/;
        var severe = /\ball the time\b|\bnon stop\b|\bbad\b|\beverytime I cough\b/;

            if(mild.test(str)) {
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                console.log('I heard the correct phrase!', str );
                chestScore++;
                console.log("the score is " + chestScore);
            }else if(severe.test(str)) {
                console.log('I heard the correct phrase!', str );
                chestScore+=2;
                console.log("the score is " + chestScore);
            }else{
                throw new Error('noMatch');
            }
    }

//......................Sinus functions...........


    function getPeriodAnswers(str, key) { //red
        console.log('get period answers');
        var mild = /\bless than a day\b|\b24-hours\b|\bless than 24-hours\b/;
        var moderate = /\bless than 7 days\b|\bless than 7-days\b|\bless than a week\b|\bcouple of days\b/;
        var severe = /\bmore than 7 days\b|\bmore than 7-days\b|\bmore than a week\b|\bover a week\b/;

            if(mild.test(str)) {
                sinuses[key] = 'mild';
                gi.constipation_period = 'mild';
            }else if(moderate.test(str)) {
                sinuses[key] = 'moderate';
                gi.constipation_period = 'moderate';
                sinusScore++;
                console.log("the score is " + sinusScore);
            }else if(severe.test(str)) {
                sinuses[key] = 'severe';
                gi.constipation_period = 'severe';
                sinusScore+=2;
                console.log("the score is " + sinusScore);
            }else{
                throw new Error('noMatch');
            }
            
            return true;

    }

        function getSinusYesNoAnswer(str, key) { //green
            if(conditionsOne.test(str)) {
                sinuses[key] = 'yes';
                sinusScore++;
                console.log("the sinus score is " + sinusScore);
                console.log('I heard the correct phrase!', str );
            } else if(conditionsTwo.test(str)){
                sinuses[key] = 'no';
                console.log('I heard the correct phrase!', str );
            }else{
                console.log('That didn\'t sound right.');
                throw new Error('noMatch');
            }
        }

        function docSinusAnswers(str, key) {
           // $scope.showYN = false;
            console.log('this will document grey answers ', str);
            sinuses[key] = str;
        }
    //....constipation

    function getGiPeriodAnswers(str, key) { //red
        console.log('get period answers');
        document.getElementById("timeBtns").style.visibility = "hidden";
        var mild = /\bless than a day\b|\b24-hours\b|\bless than 24-hours\b/;
        var moderate = /\bless than 7 days\b|\bless than 7-days\b|\bless than a week\b|\bcouple of days\b/;
        var severe = /\bmore than 7 days\b|\bmore than 7-days\b|\bmore than a week\b|\bover a week\b/;

            if(mild.test(str)) {
                //document.getElementById("YNBtns").style.visibility = "visible";
            }else if(moderate.test(str)) {
                giScore++;
                console.log("the score is " + giScore);
                //document.getElementById("YNBtns").style.visibility = "visible";
            }else if(severe.test(str)) {
                giScore+=2;
                console.log("the score is " + giScore);
               // document.getElementById("YNBtns").style.visibility = "visible";
            }else{
                throw new Error('noMatch');
            }

            return true;
    }
    function getBowelPeriod(str) { //red

        var mild = /\bless than a day\b|\b24-hours ago\b|\ba day\b|\ba day ago\b|\bless than 1 day\b/;
        var moderate = /\b1 to 3 days ago\b|\bcouple of days ago\b/;
        var severe = /\bover 3 days\b|\bover 3 days ago\b|\b3 days ago\b/;

            if(mild.test(str)) {
                console.log('I heard the correct phrase!', str );
                //document.getElementById("YNBtns").style.visibility = "visible";
                gi.constipation_bowel_motion = 'mild';
            }else if(moderate.test(str)) {
                gi.constipation_bowel_motion = 'moderate';
                console.log('I heard the correct phrase!', str );
                giScore++;
                console.log("the giscore is " + giScore);
                //document.getElementById("YNBtns").style.visibility = "visible";
            }else if(severe.test(str)) {
                gi.constipation_bowel_motion = 'severe';
                console.log('I heard the correct phrase!', str );
                giScore+=2;
                console.log("the giscore is " + giScoree);
                //document.getElementById("YNBtns").style.visibility = "visible";
            }else{
                console.log('That didn\'t sound right.');
                throw new Error('noMatch');
               // $scope.moveToNextItem("noMatch");
            }
    }

//....dirrahoea
    function getHowManyBowel(str) { //red

        var mild = /\b1 to 3\b|\b123\b/;
        var moderate = /\b3 to 6\|\b126\bb/;
        var severe = /\bmore than 6\b|\bover 6\b/;

            if(mild.test(str)) {
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                console.log('I heard the correct phrase!', str );
                giScore++;
                console.log("the giscore is " + giScore);
            }else if(severe.test(str)) {
                console.log('I heard the correct phrase!', str );
                giScore+=2;
                console.log("the giscore is " + giScore);
            }else{
                console.log('That didn\'t sound right.');
                throw new Error('noMatch');
            }
    }

//.....abdominal


    function getSuddenGradual(str) { //red

        var mild = /\bgradual\b|\bgradually\b|\bslowly\b/;
        var moderate = /\bsudden\b|\bsuddenly\b|\bout of the blue\b|\binstantly\b/;
       // var severe = /\bside\b|\bover\b/;

            if(mild.test(str)) {
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                giScore++;
                console.log("the giscore is " + giScore);
                console.log('I heard the correct phrase!', str );
            }else{
                console.log('That didn\'t sound right.');
                throw 'noMatch';
            }
    }

    function getHowSevere(str) { //red

        var mild = /\b123\b|\blower than 4\b/;
        var moderate = /\b327\b|\bbetween 3 and 7\b/;
        var severe = /\b7210\b|\bover 7\b|\bbetween 7 and 10\b/;

            if(mild.test(str)) {
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                giScore++;
                console.log("the giscore is " + giScore);
                console.log('I heard the correct phrase!', str );
            }else if(severe.test(str)) {
                giScore+=2;
                console.log("the giscore is " + giScore);
                console.log('I heard the correct phrase!', str );
            }else{
                console.log('That didn\'t sound right.');
                throw 'noMatch';
            }
    }

    function getSharpDull(str) { //red

        var mild = /\bdull\b/;
        var moderate = /\bSharp\b|\bsharp\b/;
  

            if(mild.test(str)) {
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                giScore++;
                console.log("the giscore is " + giScore);
                console.log('I heard the correct phrase!', str );
            }else{
                console.log('That didn\'t sound right.');
                throw 'noMatch';
            }
    }

    //.............yes no questions


    function getGiYesNoAnswer(str, key) { //green
        if(conditionsOne.test(str)) {
            gi[key] = 'yes';
            giScore++;
            console.log('I heard the correct phrase!', str, giScore);
        } else if(conditionsTwo.test(str)){
            gi[key] = 'no';
            console.log('I heard the correct phrase!', str, giScore );
        }else{
            console.log('That didn\'t sound right.');
            throw new Error('noMatch');
        }
    }

    function getGiNoIncrementAnswer(str, key) { //green
        if(conditionsOne.test(str)) {
            chest[key] = 'yes';
            console.log('I heard the correct phrase!', str );
            console.log("the score is " + giScore);
        } else if(conditionsTwo.test(str)){
            chest[key] = 'no';
            giScore++;
            console.log('I heard the correct phrase!', str );
            console.log("the giScore is " + giScore);
        }else{
            console.log('That didn\'t sound right.');
            throw new Error('noMatch');
        }
    }

    //document answer 
    function docAnswers(str, key) {
        console.log('this will document grey answers ', str);
        // sinuses[key] = str;
    }

    function getBaseScore() {
        console.log('the basescore is ', sinusScore);
        sinuses.basescore_result = sinusScore;
        sinuses.comparative_score = sinusScore-accounts.sinus_basescore;
    }


//////////////////////////////start talking////////////////////////////

    $scope.startScript = function () {
        $scope.moveToNextItem("start");
        recordService.audioChunks = [];
        recordService.start();
        $scope.showStart = false;
        $scope.showReason = true;
        // document.getElementById("startUp").style.visibility = "hidden";
        console.log("recorder started");
    }    
 

////////////////get actions when finished talking/////////////////////


    $scope.finishedTalking = function () {
        textContent = " ";

        if (document.getElementById("mic").style.visibility === "hidden"){
            document.getElementById("mic").style.visibility = "visible";
        } 

        function listenForNames() {
            if ($scope.line.id === "start") {
                speechService.start()
                    .then(function(result){
                        getNames(result);
                    }).catch(function(error) {
                        console.log(error);
                    });
            }    
        }
        
        function listenForReasons() {
            names.forEach(function(name){
            if ($scope.line.id === name) {
                speechService.start()
                    .then(function(result){
                        getReasons(result);
                        //document.getElementById("reasonBtns").style.visibility = "hidden";
                    })
                } 
            });  
        }

        function listenForEndReasons() {
            $scope.audio.addEventListener('ended', () => {
                speechService.start()
                     .then(function(result){
                        getReasons(result);

                        //document.getElementById("reasonBtns").style.visibility = "hidden";
                    })
                })
            }

        

//.................first branch...............//

        function MovetoReason() { 
            if ($scope.line.id === "sinuses") {
                $scope.showTime = true
                $scope.moveToNextQuestion(sinusQuestions.period)
                .then(() => listenForAnswers(sinusQuestions.period));
            }else if ($scope.line.id ===  "chest pain"){
                $scope.chestReason = true
                $scope.moveToNextQuestion(chestQuestions.chest)
                .then(() => listenForChestReasons())
            }else if ($scope.line.id ===  "gastrointestinal"){
                document.getElementById("gasReasons").style.visibility = "visible";
                $scope.moveToNextQuestion(giQuestions.gi)
                 .then(() => listenForGiReasons())
            }else if ($scope.line.id ===  "other"){
               //document.getElementById("otherReasons").style.visibility = "visible";
                $scope.moveToNextQuestion(chestQuestions.fever) 
                .then(() => listenForAdditionalAnswers(chestQuestions.fever)); 
            }else if ($scope.line.id ===  "no"){
                // document.getElementById("YNBtns").style.visibility = "visible";
                $scope.moveToNextQuestion(chestQuestions.fever) 
                $scope.showOtherReason = false
                $scope.doc = true
                .then(() => listenForAdditionalAnswers(chestQuestions.fever)); 
                }
             }
        


            
//////////////////SINUS RELATED QUESTIONS////////////////////////
        function listenForAnswers(sinusQuestion) {
            const sinusKey = sinusQuestion.id;
                $scope.audio.addEventListener('ended', () => {
                    speechService.start()
                    .then(function(result){
                        switch (sinusKey) {
                            case 'period':
                                $scope.showTime = false;
                                $scope.showYN = true;
                                return getPeriodAnswers(result, sinusKey);
                            case 'cough':
                                $scope.showYN = false;
                                $scope.doc = true;
                            case 'add_treatment':
                                return docSinusAnswers(result, sinusKey);
                            case 'other_symp':
                                $scope.doc = false;
                                $scope.showYN = true;
                               return docSinusAnswers(result, sinusKey);
                             default:
                                return getSinusYesNoAnswer(result, sinusKey);
                            }
                    })
                    .then(() => {
                        const nextQuestionIndex = sinusQuestionKeys.findIndex((question) => {
                            return question === sinusQuestion.id
                        });

                        // If we have asked all sinus questions then break the loop and send info to DB

                        if (nextQuestionIndex ===  sinusQuestionKeys.length - 1) {
                            console.log("Sinus ends")
                              getBaseScore()
                              $scope.showYN = false
                              $scope.showOtherReason = true
                              $scope.moveToNextQuestion(endQuestions.end_sinus)
                            //at the end of questions update the DB
                            return  patientService.sinuses(patientId, sinuses)
                            // //convert DB table to CSV
                            //  textFileService.textFile()
                            // //Send CSV File via mail
                            //  return sendFileService.sendMail() 
                                .then(() => {
                                    return listenForEndReasons()
                                });
                    
                        }
                        
                        //increment index to move to next question
                        const nextQuestion = sinusQuestions[sinusQuestionKeys[nextQuestionIndex + 1]];
                        return $scope.moveToNextQuestion(nextQuestion)
                            .then(() => {
                                return listenForAnswers(nextQuestion);
                            }); // Loops back through this function
                    })

                    //if error repeat question
                    .catch(function() {
                        return $scope.moveToNextQuestion(sinusQuestion)
                        .then(() => listenForAnswers(sinusQuestion)); // Ask question again
                    })
                  });
        }

   
        /////////////////////MOVE TO CHEST RELATED QUESTION///////////////////////

        function listenForChestReasons() {
            $scope.audio.addEventListener('ended', () =>{
                speechService.start()
                .then(function(result){
                    getChestReasons(result);
                })
            }); 
        }

        function MovetoChestReason() { 
            if ($scope.line.id === "cough") {
                $scope.chestReason = false
                $scope.showYN = true
                $scope.moveToNextQuestion(chestQuestions.cough)
                  .then(() => listenForCoughAnswers(chestQuestions.cough));
            }else if ($scope.line.id ===  "shortness of breath"){
                $scope.moveToNextQuestion(chestQuestions.breath) 
                $scope.showYN = true
                .then(() => listenForBreathAnswers(chestQuestions.breath));
            }else if ($scope.line.id ===  "blood in sputum"){
                $scope.showYN = true
                $scope.moveToNextQuestion(chestQuestions.blood_in_sputum) 
                .then(() => listenForBloodAnswers(chestQuestions.blood_in_sputum));
            }else if ($scope.line.id ===  "chest discomfort"){
                $scope.showYN = true
                $scope.moveToNextQuestion(chestQuestions.chest_discomfort) 
                .then(() => listenForChestAnswers(chestQuestions.chest_discomfort));
            }else if ($scope.line.id ===  "additional"){
                $scope.doc = true
                $scope.moveToNextQuestion(chestQuestions.fever) 
                .then(() => listenForAdditionalAnswers(chestQuestions.fever));
            }else if ($scope.line.id ===  "next"){
                $scope.otherchestReason = false
                $scope.showOtherReason = true
                $scope.moveToNextQuestion(endQuestions.end_chest)
                .then(() => listenForEndReasons());
            }
        }

//...........cough questions within chest.....................................
       

function listenForCoughAnswers(chestQuestion) {
    const coughKey = chestQuestion.id;
        $scope.audio.addEventListener('ended', () => {
            speechService.start()
            .then(function(result){
                switch (coughKey) {
                    case 'different':
                        $scope.showYN = false;
                        $scope.showTime = true;
                        return getChestYesNoAnswer(result, coughKey);
                    // LOOK TO CHANGE FLOW HERE
                    case 'cough_period':
                        $scope.showTime = false;
                        $scope.showYN = true;
                        return getChestPeriodAnswers(result, coughKey);;
                    case 'sputum':
                        $scope.showYN = false;
                        $scope.showColour = true;
                        return getChestYesNoAnswer(result, coughKey);
                    case 'colour':
                        $scope.showColour = false;
                        $scope.doc = true;
                        return getDifColour(result, coughKey);
                    case 'difColour':
                        $scope.doc = false;
                        $scope.showAmount = true;
                        return docAnswers(result, coughKey);
                    case 'much':
                        $scope.showAmount = false;
                        $scope.showYN = true;
                        return getAmount(result, coughKey);
                    case 'easily':
                        return getChestNoIncrementAnswer(result, coughKey);
                    case 'blood':
                        $scope.showYN = false;
                        $scope.showBetter = true;
                        return getChestYesNoAnswer(result, coughKey);
                    case 'better':
                        $scope.showBetter = false;
                        $scope.doc = true;
                        return getBetter(result, coughKey);
                    case 'add_treatment':
                        return docAnswers(result, coughKey);
                       // getBaseScore(result);
                    default:
                        return getChestYesNoAnswer(result, coughKey);
                    }
            })
            .then(() => {
                const nextQuestionIndex = chestQuestionKeys.findIndex((question) => {
                    return question === chestQuestion.id
                });

                // If we have asked all sinus questions then break the loop and send info to DB

                if (nextQuestionIndex === 12) {
                    $scope.moveToNextQuestion(endQuestions.end_chest_branches)
                    $scope.doc = false
                    $scope.otherchestReason = true
                    console.log("end Cough branch")
                    return  patientService.sinuses(1, sinuses)
                     .then(() => {
                        return listenForChestReasons()
                 })
                }
                
                //increment index to move to next question
                const nextQuestion = chestQuestions[chestQuestionKeys[nextQuestionIndex + 1]];
                return $scope.moveToNextQuestion(nextQuestion)
                    .then(() => {
                        return listenForCoughAnswers(nextQuestion);
                    }); // Loops back through this function
            })

            //if error repeat question
            .catch(function() {
                return $scope.moveToNextQuestion(chestQuestion)
                .then(() => listenForCoughAnswers(chestQuestion)); // Ask question again
            })
          });
}

//...........breath questions within chest.....................................

function listenForBreathAnswers(chestQuestion) {
    const breathKey = chestQuestion.id;
        $scope.audio.addEventListener('ended', () => {
            speechService.start()
            .then(function(result){
                switch (breathKey) {
                    case 'breath':
                        return getChestYesNoAnswer(result, breathKey);
                    case 'breath_period':
                        return getChestPeriodAnswers(result, breathKey);;
                    case 'sudden':
                        return getChestSuddenGradual(result, breathKey);
                    case 'affected':
                        return getMildSevere(result, breathKey);
                    //THIS NEEDS TO GET SORTED
                    case 'add_treatment':
                        return docAnswers(result, breathKey);
                    case 'other_symp':
                       // getBaseScore(result);
                       return docAnswers(result, breathKey);
                    default:
                        return getChestYesNoAnswer(result, breathKey);
                    }
            })
            .then(() => {
                const nextQuestionIndex = chestQuestionKeys.findIndex((question) => {
                    return question === chestQuestion.id
                });

                // If we have asked all sinus questions then break the loop and send info to DB

                if (nextQuestionIndex === 21) {
                    $scope.moveToNextQuestion(endQuestions.end_chest_branches)
                    console.log("end breath branch")
                    return  patientService.sinuses(1, sinuses)
                    .then(() => {
                       return listenForChestReasons()
                })
                }
                
                //increment index to move to next question
                const nextQuestion = chestQuestions[chestQuestionKeys[nextQuestionIndex + 1]];
                return $scope.moveToNextQuestion(nextQuestion)
                    .then(() => {
                        return listenForBreathAnswers(nextQuestion);
                    }); // Loops back through this function
            })

            //if error repeat question
            .catch(function() {
                return $scope.moveToNextQuestion(chestQuestion)
                .then(() => listenForBreathAnswers(chestQuestion)); // Ask question again
            })
          });
}


//................blood..........................//

function listenForBloodAnswers(chestQuestion) {
    const bloodKey = chestQuestion.id;
        $scope.audio.addEventListener('ended', () => {
            speechService.start()
            .then(function(result){
                switch (bloodKey) {
                    case 'blood_in_sputum':
                        return getChestYesNoAnswer(result, bloodKey);
                    case 'red_flag_one':
                        //RED FLAG ADD WARNING LARGE NUMBER
                        return getRedFlagAnswer(result, bloodKey);
                    case 'amount':
                        return getAmount(result, bloodKey);
                    case 'period':
                        return getHowManyTimes(result, bloodKey);
                    default:
                        return getChestYesNoAnswer(result, bloodKey);
                    }
            })
            .then(() => {
                const nextQuestionIndex = chestQuestionKeys.findIndex((question) => {
                    return question === chestQuestion.id
                });

                // If we have asked all sinus questions then break the loop and send info to DB

                if (nextQuestionIndex === 27) {
                    $scope.moveToNextQuestion(endQuestions.end_chest_branches)
                    console.log("end blood branch")
                    return  patientService.sinuses(1, sinuses)
                    .then(() => {
                       return listenForChestReasons()
                })
 
                }
                
                //increment index to move to next question
                const nextQuestion = chestQuestions[chestQuestionKeys[nextQuestionIndex + 1]];
                return $scope.moveToNextQuestion(nextQuestion)
                    .then(() => {
                        return listenForBloodAnswers(nextQuestion);
                    }); // Loops back through this function
            })

            //if error repeat question
            .catch(function() {
                return $scope.moveToNextQuestion(chestQuestion)
                .then(() => listenForBloodAnswers(chestQuestion)); // Ask question again
            })
          });
}

//............chest pain..............

function listenForChestAnswers(chestQuestion) {
    const chestKey = chestQuestion.id;
        $scope.audio.addEventListener('ended', () => {
            speechService.start()
            .then(function(result){
                switch (chestKey) {
                    case 'chest_discomfort':
                        return getChestYesNoAnswer(result, chestKey);
                    case 'chest_period':
                        return getChestPeriodAnswers(result, chestKey);
                    case 'start':  
                        return getChestSuddenGradual(result, chestKey);
                    case 'red_flag_two':
                        //RED FLAG ADD WARNING LARGE NUMBER
                        return getRedFlagAnswer(result, chestKey);
                    case 'what':
                        return docAnswers(result, chestKey);
                    //THIS NEEDS TO GET SORTED
                    case 'add_treatment':
                        return docAnswers(result, chestKey);
                    case 'other_symp':
                      //  getBaseScore(result);
                       return docAnswers(result, chestKey);
                    default:
                        return getChestYesNoAnswer(result, chestKey);
                    }
            })
            .then(() => {
                const nextQuestionIndex = chestQuestionKeys.findIndex((question) => {
                    return question === chestQuestion.id
                });

                // If we have asked all sinus questions then break the loop and send info to DB

                if (nextQuestionIndex === 38) {
                    $scope.moveToNextQuestion(endQuestions.end_chest_branches)
                    console.log("end breath branch")
                    return  patientService.sinuses(1, sinuses)
                    .then(() => {
                       return listenForChestReasons()
                })
                }
                
                //increment index to move to next question
                const nextQuestion = chestQuestions[chestQuestionKeys[nextQuestionIndex + 1]];
                return $scope.moveToNextQuestion(nextQuestion)
                    .then(() => {
                        return listenForChestAnswers(nextQuestion);
                    }); // Loops back through this function
            })

            //if error repeat question
            .catch(function() {
                return $scope.moveToNextQuestion(chestQuestion)
                .then(() => listenForChestAnswers(chestQuestion)); // Ask question again
            })
          });
}

//.................additional.................
      //THIS NEEDS TO BE ADD TO THE END OF EVERY SECTION
        function listenForAdditionalAnswers(chestQuestion) {
            const addKey = chestQuestion.id;
            $scope.audio.addEventListener('ended', () => {
                speechService.start()
                .then(function(result){
                    switch (addKey) {
                        default:
                            return docAnswers(result, addKey);
                        }
                })

                .then(() => {
                    const nextQuestionIndex = chestQuestionKeys.findIndex((question) => {
                        return question === chestQuestion.id
                    });

                    if (nextQuestionIndex === 43) {
                                //document.getElementById("DocAn").style.visibility = "hidden";
                                console.log("Additional is over")
                                if (sinusScore == 0 && chestScore == 0 && giScore == 0){
                                    console.log("mild base score")
                                    document.getElementById("mild").style.visibility = "visible";
                                    return $scope.moveToNextItem("mild") 
                                }else if (sinusScore > 0 && sinusScore <= 7){
                                    console.log("moderate base score")
                                    document.getElementById("moderate").style.visibility = "visible";
                                    return $scope.moveToNextItem("moderate")
                                }else if (chestScore > 0 && chestScore <= 5){
                                    console.log("mild base score")
                                    document.getElementById("mild").style.visibility = "visible";
                                    return $scope.moveToNextItem("mild") 
                                }else if (chestScore > 5 && chestScore <= 12){
                                    console.log("moderate base score")
                                    document.getElementById("moderate").style.visibility = "visible";
                                    return $scope.moveToNextItem("moderate")
                                }else if (chestScore > 12 &&  chestScore <= 20){
                                    console.log("severe base score")
                                    document.getElementById("severe").style.visibility = "visible";
                                    return $scope.moveToNextItem("severe")
                                }else if (chestScore >= 20){
                                    document.getElementById("urgent").style.visibility = "visible";
                                    console.log("urgent base score")
                                    return $scope.moveToNextItem("urgent")
                                }else if (giScore > 0 && giScore <= 9){
                                    console.log("mild base score")
                                    document.getElementById("mild").style.visibility = "visible";
                                    return $scope.moveToNextItem("mild") 
                                }else if (giScore > 9 && giScore <= 15){
                                    console.log("moderate base score")
                                    document.getElementById("moderate").style.visibility = "visible";
                                    return $scope.moveToNextItem("moderate")
                                }else if (giScore > 15){
                                    console.log("severe base score")
                                    document.getElementById("severe").style.visibility = "visible";
                                    return $scope.moveToNextItem("severe")
                           }
                               textFileService.textFile()
                               return sendFileService.sendMail()
                
                       }
                    
                    const nextQuestion = chestQuestions[chestQuestionKeys[nextQuestionIndex + 1]];
                        return $scope.moveToNextQuestion(nextQuestion)
                            .then(() => {
                                return listenForAdditionalAnswers(nextQuestion);
                            }); 
                        })

                .catch(function() {
                    return $scope.moveToNextQuestion(chestQuestion)
                    .then(() => listenForAdditionalAnswers(chestQuestion));  
                })
            });
        }

////////////////////MOVE TO GI QUESTIONS////////////////////////////

        function listenForGiReasons() {
            $scope.audio.addEventListener('ended', () =>{
                speechService.start()
                .then(function(result){
                    getGiReasons(result);
                })
            }); 
        }
        //.................first gi branch...............//

        function MovetoGiReason() { 
            if ($scope.line.id === "constipation") {
                $scope.moveToNextQuestion(giQuestions.constipation)
                .then(() => listenForConstipationAnswers(giQuestions.constipation));
            }else if ($scope.line.id ===  "diarrhoea"){
                $scope.moveToNextQuestion(giQuestions.diarrhoea) 
                .then(() => listenForDiarrhoeaAnswers(giQuestions.diarrhoea));
            }else if ($scope.line.id ===  "abdominal pain"){
                $scope.moveToNextQuestion(giQuestions.abdominal_pain)
                .then(() => listenForAbdominalAnswers(giQuestions.abdominal_pain)); 
            }else if ($scope.line.id ===  "vomiting"){
                $scope.moveToNextQuestion(giQuestions.vomit)
                .then(() => listenForVomitAnswers(giQuestions.vomit));
            }else if ($scope.line.id ===  "heartburn"){
                $scope.moveToNextQuestion(giQuestions.heartburn) 
                .then(() => listenForHeartburnAnswers(giQuestions.heartburn));
            }else if ($scope.line.id ===  "not"){
                $scope.moveToNextQuestion(endQuestions.end_gas)
                .then(() => listenForEndReasons());
        }
        }
        //...............move to CONSTIPATION question..................//
        
        function listenForConstipationAnswers(giQuestion) {
            const ConstipationKey = giQuestion.id;
                $scope.audio.addEventListener('ended', () => {
                    speechService.start()
                    .then(function(result){
                        switch (ConstipationKey) {
                            case 'constipation':
                                return getGiYesNoAnswer(result, ConstipationKey);
                            case 'constipation_period':
                                return getGiPeriodAnswers(result, ConstipationKey);
                            case 'constipation_bowel_motion':  
                                return getBowelPeriod(result, ConstipationKey);
                            case 'previous': 
                                return docAnswers(result, ConstipationKey);
                            case 'constipation_eating': 
                                return  getGiNoIncrementAnswer(result, ConstipationKey);
                                //getBaseScore(result);
                            default:
                                return getGiYesNoAnswer(result, ConstipationKey);
                            }
                    })
                    .then(() => {
                        const nextQuestionIndex = giQuestionKeys.findIndex((question) => {
                            return question === giQuestion.id
                        });
        
                        // If we have asked all sinus questions then break the loop and send info to DB
        
                        if (nextQuestionIndex === 8) {
                            $scope.moveToNextQuestion(endQuestions.end_gas_branches)
                            console.log("end breath branch")
                            return  patientService.sinuses(1, sinuses)
                            .then(() => {
                               return listenForGiReasons()
                        })
                        }
                        
                        //increment index to move to next question
                        const nextQuestion = giQuestions[giQuestionKeys[nextQuestionIndex + 1]];
                        return $scope.moveToNextQuestion(nextQuestion)
                            .then(() => {
                                return listenForConstipationAnswers(nextQuestion);
                            }); // Loops back through this function
                    })
        
                    //if error repeat question
                    .catch(function() {
                        return $scope.moveToNextQuestion(giQuestion)
                        .then(() => listenForConstipationAnswers(giQuestion)); // Ask question again
                    })
                  });
        }


        //...................DIARRHOEA questions......................//

        function listenForDiarrhoeaAnswers(giQuestion) {
            const diarrhoeaKey = giQuestion.id;
                $scope.audio.addEventListener('ended', () => {
                    speechService.start()
                    .then(function(result){
                        switch (diarrhoeaKey) {
                            case 'diarrhoea':
                                return getGiYesNoAnswer(result, diarrhoeaKey);
                            case 'diarrhoea_period':
                                return getGiPeriodAnswers(result, diarrhoeaKey);
                            case 'diarrheoa_bowel_motion':  
                                return getHowManyBowel(result, diarrhoeaKey);
                            //THIS NEEDS TO GET SORTED
                            case 'add_treatment':
                                return docAnswers(result, diarrhoeaKey);
                            case 'other_symp':
                               // getBaseScore(result);
                               return docAnswers(result, diarrhoeaKey);
                            default:
                                return getGiYesNoAnswer(result, diarrhoeaKey);
                            }
                    })
                    .then(() => {
                        const nextQuestionIndex = giQuestionKeys.findIndex((question) => {
                            return question === giQuestion.id
                        });
        
                        // If we have asked all sinus questions then break the loop and send info to DB
        
                        if (nextQuestionIndex === 16) {
                            $scope.moveToNextQuestion(endQuestions.end_gas_branches)
                            console.log("end breath branch")
                            return  patientService.sinuses(1, sinuses)
                            .then(() => {
                               return listenForGiReasons()
                        })
                        }
                        
                        //increment index to move to next question
                        const nextQuestion = giQuestions[giQuestionKeys[nextQuestionIndex + 1]];
                        return $scope.moveToNextQuestion(nextQuestion)
                            .then(() => {
                                return listenForDiarrhoeaAnswers(nextQuestion);
                            }); // Loops back through this function
                    })
        
                    //if error repeat question
                    .catch(function() {
                        return $scope.moveToNextQuestion(giQuestion)
                        .then(() => listenForDiarrhoeaAnswers(giQuestion)); // Ask question again
                    })
                  });
        }

        //..............ADBOMINAL QUESTION..........................//

   
        function listenForAbdominalAnswers(giQuestion) {
            const abKey = giQuestion.id;
                $scope.audio.addEventListener('ended', () => {
                    speechService.start()
                    .then(function(result){
                        switch (abKey) {
                            case 'abdominal_pain':
                                return getGiYesNoAnswer(result, abKey);
                            case 'where':
                                return docAnswers(result, abKey);
                            case 'abdominal_pain_period':  
                                return getGiPeriodAnswers(result, abKey);
                            case 'abdominal_pain_sudden':
                                return getSuddenGradual(result, abKey);
                            case 'severe':
                                return getHowSevere(result, abKey);
                            case 'sharp':
                                return getSharpDull(result, abKey);
                            case 'bowel_motion':
                                return  getGiNoIncrementAnswer(result, abKey);
                            case 'urine':
                                return  getGiNoIncrementAnswer(result, abKey);
                            case 'abdominal_pain_eating':
                                return  getGiNoIncrementAnswer(result, abKey);
                            default:
                                return getGiYesNoAnswer(result, abKey);
                            }
                    })
                    .then(() => {
                        const nextQuestionIndex = giQuestionKeys.findIndex((question) => {
                            return question === giQuestion.id
                        });
        
                        // If we have asked all sinus questions then break the loop and send info to DB
        
                        if (nextQuestionIndex === 29) {
                            $scope.moveToNextQuestion(endQuestions.end_gas_branches)
                            console.log("end breath branch")
                            return  patientService.sinuses(1, sinuses)
                            .then(() => {
                               return listenForGiReasons()
                        })
                        }
                        
                        //increment index to move to next question
                        const nextQuestion = giQuestions[giQuestionKeys[nextQuestionIndex + 1]];
                        return $scope.moveToNextQuestion(nextQuestion)
                            .then(() => {
                                return listenForAbdominalAnswers(nextQuestion);
                            }); // Loops back through this function
                    })
        
                    //if error repeat question
                    .catch(function() {
                        return $scope.moveToNextQuestion(giQuestion)
                        .then(() => listenForAbdominalAnswers(giQuestion)); // Ask question again
                    })
                  });
        }

        // function listenForAbdominalAnswers(giQuestion) {

        //         $scope.audio.addEventListener('ended', () => {
        //             speechService.start()
        //             .then(function(result){
        //                 switch (giQuestionKeys[abIndex]) {
        //                     case 'where':
        //                         return getGiYesNoAnswer(result);
        //                     case 'abdominal_pain_period':
        //                         return getWherePain(result);
        //                     case 'abdominal_pain_sudden':
        //                         return getPeriodAnswers(result);
        //                     case 'all_time':
        //                         return getSuddenGradual(result);
        //                     case 'deteriorate':
        //                         return getGiYesNoAnswer(result);
        //                     case 'severe':
        //                         return getGiYesNoAnswer(result);
        //                     case 'sharp':
        //                         return getHowSevere(result);
        //                     case 'bowel_motion':
        //                         return getSharpDull(result);
        //                     default:
        //                         return getGiYesNoAnswer(result, giQuestionKeys[abIndex]);
        //                     }
        //             })
        //             .then(() => {
        //                 return $scope.moveToNextQuestion(giQuestion)
        //                 .then(() => {
        //                     abIndex++;
        //                     switch (giQuestionKeys[abIndex - 1]) {
        //                          case "vomit":
        //                              break;
                              
        //                         default:
        //                             return listenForAbdominalAnswers(giQuestions[giQuestionKeys[abIndex]]);
        //                     }
        //                 }); // Loops back through this function
        //             })
        //             .catch(function(error) {
        //                 console.log(error);
        //                 return $scope.moveToNextQuestion(giQuestions[giQuestionKeys[abIndex - 1]])
        //                 .then(() => {
        //                     switch (giQuestionKeys[abIndex - 1]) {
        //                         // case "other_symp":
        //                         //     return listenForReasons();
        //                         default:
        //                             console.log(giQuestionKeys[abIndex]);
        //                             return listenForAbdominalAnswers(giQuestions[giQuestionKeys[abIndex]]);
                                    
        //                     }
        //                 }); // Loops back through this function
        //             })
        //         });
        // }

        //..............VOMIT QUESTIONS...................//

        function listenForVomitAnswers(giQuestion) {
            const vomitKey = giQuestion.id;
                $scope.audio.addEventListener('ended', () => {
                    speechService.start()
                    .then(function(result){
                        switch (vomitKey) {
                            case 'vomit':
                                return docAnswers(result, vomitKey);
                            default:
                                return docAnswers(result, vomitKey);
                            }
                    })
                    .then(() => {
                        const nextQuestionIndex = giQuestionKeys.findIndex((question) => {
                            return question === giQuestion.id
                        });
        
                        // If we have asked all sinus questions then break the loop and send info to DB
        
                        if (nextQuestionIndex === 37) {
                            $scope.moveToNextQuestion(endQuestions.end_gas_branches)
                            console.log("end breath branch")
                            return  patientService.sinuses(1, sinuses)
                            .then(() => {
                               return listenForGiReasons()
                        })
                        }
                        
                        //increment index to move to next question
                        const nextQuestion = giQuestions[giQuestionKeys[nextQuestionIndex + 1]];
                        return $scope.moveToNextQuestion(nextQuestion)
                            .then(() => {
                                return listenForVomitAnswers(nextQuestion);
                            }); // Loops back through this function
                    })
        
                    //if error repeat question
                    .catch(function() {
                        return $scope.moveToNextQuestion(giQuestion)
                        .then(() => listenForVomitAnswers(giQuestion)); // Ask question again
                    })
                  });
        }

        //...............HEARTBURN QUESTIONS............//


        function listenForHeartburnAnswers(giQuestion) {
            const heartburnKey = giQuestion.id;
                $scope.audio.addEventListener('ended', () => {
                    speechService.start()
                    .then(function(result){
                        switch (heartburnKey) {
                            case 'heartburn':
                                return docAnswers(result, heartburnKey);
                            default:
                                return docAnswers(result, heartburnKey);
                            }
                    })
                    .then(() => {
                        const nextQuestionIndex = giQuestionKeys.findIndex((question) => {
                            return question === giQuestion.id
                        });
        
                        // If we have asked all sinus questions then break the loop and send info to DB
        
                        if (nextQuestionIndex === giQuestionKeys.length - 1) {
                            $scope.moveToNextQuestion(endQuestions.end_gas_branches)
                            console.log("end breath branch")
                            return  patientService.sinuses(1, sinuses)
                            .then(() => {
                               return listenForGiReasons()
                        })
                        }
                        
                        //increment index to move to next question
                        const nextQuestion = giQuestions[giQuestionKeys[nextQuestionIndex + 1]];
                        return $scope.moveToNextQuestion(nextQuestion)
                            .then(() => {
                                return listenForHeartburnAnswers(nextQuestion);
                            }); // Loops back through this function
                    })
        
                    //if error repeat question
                    .catch(function() {
                        return $scope.moveToNextQuestion(giQuestion)
                        .then(() => listenForHeartburnAnswers(giQuestion)); // Ask question again
                    })
                  });
        }

        // //let heartburnIndex = 39;

        // function listenForHeartburnAnswers(giQuestion) {

        //         $scope.audio.addEventListener('ended', () => {
        //             speechService.start()
        //             .then(function(result){
        //                 switch (giQuestionKeys[heartburnIndex]) {
        //                     default:
        //                         return docAnswers(result, giQuestionKeys[heartburnIndex]);
        //                     }
        //             })
        //             .then(() => {
        //                 return $scope.moveToNextQuestion(giQuestion)
        //                 .then(() => {
        //                     heartburnIndex++;
        //                     switch (giQuestionKeys[heartburnIndex  - 1]) {
        //                          case "heartburn_times":
        //                              break;
        //                         default:
        //                             return listenForHeartburnAnswers(giQuestions[giQuestionKeys[heartburnIndex]]);
        //                     }
        //                 }); // Loops back through this function
        //             })
        //             .catch(function(error) {
        //                 console.log(error);
        //                 return $scope.moveToNextQuestion(giQuestions[giQuestionKeys[vomitIndex  - 1]])
        //                 .then(() => {
        //                     switch (giQuestionKeys[heartburnIndex  - 1]) {
        //                         // case "other_symp":
        //                         //     return listenForReasons();
        //                         default:
        //                             console.log(giQuestionKeys[heartburnIndex ]);
        //                             return listenForHeartburnAnswers(giQuestions[giQuestionKeys[heartburnIndex]]);
                                    
        //                     }
        //                 }); // Loops back through this function
        //             })
        //         });
        // }


//....................listen for other related questions....................

        function listenForNameError() {
            if ($scope.line.id === "noMatch") {
                speechService.start()
                .then(function(result){
                    getNames(result);
                }).catch(function(error) {
                    console.log(error);
                });
            }
        }

        function listenForReasonError() {
            if ($scope.line.id === "noReasonMatch") {
                speechService.start()
                .then(function(result){
                    getReasons(result);
                }).catch(function(error) {
                    console.log(error);
                });
            }
        }

        function listenForChestError() {
            if ($scope.line.id === "noChestMatch") {
                speechService.start()
                .then(function(result){
                    getChestReasons(result);
                }).catch(function(error) {
                    console.log(error);
                });
            }
        }

        function listenForGiError() {
            if ($scope.line.id === "noGiMatch") {
                speechService.start()
                .then(function(result){
                    getGiReasons(result);
                }).catch(function(error) {
                    console.log(error);
                });
            }
        }
     
     
     
        listenForNames ();
        listenForReasons();
        MovetoReason();
        MovetoChestReason();
        MovetoGiReason();
        //MovetoEndReason();
        listenForNameError();
        listenForReasonError()
        listenForChestError()
        listenForGiError()
    }

    $scope.moveToNextItem = function(id) {
        scriptService.getNextLine(id).then(function (d) {
            line = d;
            console.log("Got", line);
            if (line.end) {
                $scope.data.subtitles = "";
                return;
            }
            $scope.data.line = {};
            return scriptService.getVisemes(line.speechid)
        }).then(function (visemes) {
            console.log("Got visemes", visemes);
            $scope.data.subtitles = line.sub || line.text;
            $scope.line = line;
            $scope.audio = new Audio('api/speech/' + line.speechid);
            $scope.audio.load();
            buildSpeechTweens(visemes);
            $scope.audio.play();
            self.tweens[self.tweens.length - 1].current = 0;
            return id;
        });
    }

    $scope.moveToNextQuestion = function(question) {
        console.log("Got", question);
        return scriptService.getVisemes(question.speechid)
        .then(function (visemes) {
            $scope.data.subtitles = question.text;
            $scope.line = question.text;
            $scope.audio = new Audio('api/speech/' + question.speechid);
            $scope.audio.load();
            buildSpeechTweens(visemes);
            $scope.audio.play();
            self.tweens[self.tweens.length - 1].current = 0;
            return question;
        });
    }
    initialise();
}]);


