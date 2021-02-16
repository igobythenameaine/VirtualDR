
app.controller("playerController",
 ['$scope', 'questionbranchService','questionGiService','questionChestService', 'questionSinusService', 'questionEndService', 'patientService', 'speechService', 'sceneService', 'avatarService', 'scriptService','accountService', 'questionObjectiveService', 
 function ($scope, questionbranchService, questionGiService, questionChestService, questionSinusService, questionEndService, patientService, speechService, sceneService, avatarService, scriptService, accountService, questionObjectiveService) {
    
    let myobj = document.getElementById("words");

    let sinusScore = 0;
    let chestScore = 0;
    let giScore = 0;
    let obScore = 0;

    let chestQuestions;
    let chestQuestionKeys;

    let endQuestions;
    let endQuestionKeys;

    let obQuestions;
    let obQuestionKeys;

    let sinusQuestions;
    let sinusQuestionKeys;

    let giQuestions;
    let giQuestionKeys;
    
    let accounts;

    let patientId;
   
    let lfReadings = [];

    var sinuses = {};
    var gi = {};
    var chest = {};
    var ob = {};

    $scope.data = {};
    $scope.data.subtitles = " ";
    $scope.data.line = {};
   
    $scope.data.guide = " ";
    $scope.data.images = " ";

    $scope.start = "This aplication is going to ask a number of questions about your health.If you would like to watch a video on how to use the virtual doctor tool, select 'play video'. If you wish to proceed with the visitation press the 'start visit' button"
    $scope.showStart = true;
    
    $scope.firstReason = "Chest pain"
    $scope.secondReason = "Sinuses"
    $scope.thirdReason = "Gastrointestinal"
    $scope.otherReason = "Other"
    $scope.noReason = "No"

    $scope.firstChest = "Cough"
    $scope.secondChest = "Shortness of breath"
    $scope.thirdChest = "Blood in Sputum"
    $scope.fourChest = "Chest discomfort"

    $scope.firstGi = "Constipation"
    $scope.secondGi = "Diarrhoea"
    $scope.thirdGi = "Abdominal Pain"
    $scope.fourGi = "Vomiting"
    $scope.fiveGi = "Heartburn"
    
    $scope.lookingAt = "default";

    var self = this;
    var webGL;
    self.tweens = [];

            
    // window.addEventListener("mousemove", onmousemove, false);
  
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

        // get patient id from cookie
        const patientIdCookie = document.cookie.split(';').find(cookie => cookie.startsWith('patientId')); 
        patientId = patientIdCookie.split('=')[1];

        //get all questions from database

        sinusQuestions = await questionSinusService.getAll();
        sinusQuestionKeys = Object.keys(sinusQuestions);

        console.log(sinusQuestions, sinusQuestionKeys);

        giQuestions = await questionGiService.getAll();
        giQuestionKeys = Object.keys(giQuestions);
        console.log(giQuestions, giQuestionKeys);

        accounts = await accountService.getPatient(patientId);
        console.log(accounts);

        chestQuestions = await questionChestService.getAll();
        chestQuestionKeys = Object.keys(chestQuestions);
        console.log(chestQuestions, chestQuestionKeys);

        endQuestions = await questionEndService.getAll();
        endQuestionKeys = Object.keys(endQuestions);
        console.log(endQuestions, endQuestionKeys);

        obQuestions = await questionObjectiveService.getAll();
        obQuestionKeys = Object.keys(obQuestions);
        console.log(obQuestions, obQuestionKeys);

        branchQuestions = await questionbranchService.getAll();
        branchQuestionKeys = Object.keys(branchQuestions);
        console.log(branchQuestions, branchQuestionKeys);


        //hide mic upon loading
        document.getElementById("mic").style.visibility = "hidden";
        
        //initialise 3D scene and avatar  
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
     }
    
     //animate eyes
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

    //animate blinking
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

    //animate tweens
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
//functions to determine the key words needed to be identified before moving to next question. 

//.........get reasons...........//

    function getReasons(str) {

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

        const chestReasons = ['cough', 'shortness of breath', 'blood in sputum', 'chest discomfort', 'additional', 'none'];

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
    var mild = /\bless than a day\b|\b24-hours\b|\bless than 24-hours\b|\ba day ago\b|\ba day\b/;
    var moderate = /\bless than 7 days\b|\bless than 7-days\b|\bless than a week\b|\bcouple of days\b|\ba few days ago\b|\ba few days\b/;
    var severe = /\bmore than 7 days\b|\bmore than 7-days\b|\bmore than a week\b|\bover a week\b|\bover a week ago\b/;

        if(mild.test(str)) {
            chest[key] = 'less than a day';
             console.log('I heard the correct phrase!', str );
        }else if(moderate.test(str)) {
            chest[key] = 'less than 7 days';
            chestScore++;
            console.log("the score is " + chestScore);
            console.log('I heard the correct phrase!', str );
        }else if(severe.test(str)) {
            chest[key] = 'more than 7 days';
            chestScore+=2;
            console.log("the score is " + chestScore);
            console.log('I heard the correct phrase!', str );
        }else{
            throw new Error('noMatch');
        }

        return true;
}

    function docChestAnswers(str, key) {
        console.log('this will document grey answers ', str);
        chest[key] = str;
    }
//......cough questions functions..................

    function getDifColour(str, key) { //red

        var mild = /\bclear\b|\bcolourless\b|\bcreamy\b/;
        var moderate = /\bgreen\b|\byellow\b|\bGreen\b|\bpurulent\b/;
        var severe = /\bbrown\b|\bdark\b|\bBrown\b|\bdirty\b|\bblood\b|\bhorrible\b|\bdisgusting\b/;

            if(mild.test(str)) {
                console.log('I heard the correct phrase!', str );
                chest[key] = 'clear';
            }else if(moderate.test(str)) {
                console.log('I heard the correct phrase!', str );
                chest[key] = 'yellow/green';
                chestScore++;
                console.log("the chestScore is " + chestScore);
            }else if(severe.test(str)) {
                console.log('I heard the correct phrase!', str );
                chest[key] = 'brown';
                chestScore+=2;
                console.log("the chestScore is " + chestScore);
            }else{
                throw new Error('noMatch');
        
            }
    }

    function getAmount(str, key) { //red
        var mild = /\bnone\b|\blittle\b|\bsmall amount\b|\ba mounth full\b|\bless than a mounth full\b|\bnormal\b/;
        var moderate = /\bmouthfuls\b|\bmore than normal\b/;
        var severe = /\bloads\b|\blots\b|\ba lot\b|\balot\b|\ban awful lot\b|\btonnes\b|\bheaps\b|\balot more than normal\b|\bway than normal\b/;

            if(mild.test(str)) {
                chest[key] = 'none/little';
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                chest[key] = 'mouthfuls';
                console.log('I heard the correct phrase!', str );
                chestScore++;
                console.log("the chestScore is " + chestScore);   
            }else if(severe.test(str)) {
                chest[key] = 'lots';
                console.log('I heard the correct phrase!', str );
                chestScore+=2;
                console.log("the chestScore is " + chestScore);
              
            }else{
                throw new Error('noMatch');
               
            }
    }
  
    function getBetter(str, key) { //red

        var mild = /\bbetter\b/;
        var moderate = /\bworse\b|\bworst\b/;
        var severe = /\bsame\b/;

            if(mild.test(str)) {
                chest[key] = 'better';
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                console.log('I heard the correct phrase!', str );
                chest[key] = 'worse';
                chestScore++;
                console.log("the chestScore is " + chestScore);
            }else if(severe.test(str)) {
                chest[key] = 'same';
                console.log('I heard the correct phrase!', str );
                chestScore+=2;
                console.log("the chestScore is " + chestScore);
            }else{
                throw new Error('noMatch');
        
            }
    }
//..............short of breath questions functions...........  
function getChestSuddenGradual(str, key) { //red

    var mild = /\bgradual\b|\bgradually\b|\bslowly\b/;
    var moderate = /\bsudden\b|\bsuddenly\b|\bout of the blue\b|\binstantly\b/;

        if(mild.test(str)) {
            chest[key] = 'gradual';
            console.log('I heard the correct phrase!', str );
        }else if(moderate.test(str)) {
            chest[key] = 'sudden';
            chestScore++;
            console.log('I heard the correct phrase!', str );
            console.log("the score is " + chestScore);
        }else{
            console.log('That didn\'t sound right.');
            throw 'noMatch';
        }
}

    function getMildSevere(str, key) { //red

        var mild = /\bmild\b|\bmildly\b|\ba little\b|\ba small bit\b/;
        var moderate = /\bmoderate\b|\bmoderately\b|\ba bit\b/;
        var severe = /\bseverely\b|\ba lot\b|\bbad\b|\bsevere\b/;

            if(mild.test(str)) {
                chest[key] = 'mild';
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                console.log('I heard the correct phrase!', str );
                chest[key] = 'moderate';
                chestScore++;
                console.log("the chestScore is " + chestScore);
            }else if(severe.test(str)) {
                chest[key] = 'severe';
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
            chest[key] = 'YES (RED FLAG ATTENTION REQUIRED)';
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

    function getHowManyTimes(str, key) { //red

        var mild = /\bonce\b|\brarley\b|\bodd time\b/;
        var moderate = /\ba couple of times\b|\ba few times\b|\bmore than once\b/;
        var severe = /\ball the time\b|\bnon stop\b|\bbad\b|\beverytime I cough\b/;

            if(mild.test(str)) {
                chest[key] = 'once';
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                chest[key] = 'a few times';
                console.log('I heard the correct phrase!', str );
                chestScore++;
                console.log("the score is " + chestScore);
            }else if(severe.test(str)) {
                chest[key] = 'all the time';
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
                sinuses[key] = 'less than a day';
            }else if(moderate.test(str)) {
                sinuses[key] = 'less than a week';
                sinusScore++;
                console.log("the score is " + sinusScore);
            }else if(severe.test(str)) {
                sinuses[key] = 'over a week';
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
            console.log('this will document grey answers ', str);
            sinuses[key] = str;
        }
    //....constipation

    function getGiPeriodAnswers(str, key) { //red
        console.log('get period answers');
        var mild = /\bless than a day\b|\b24-hours\b|\bless than 24-hours\b/;
        var moderate = /\bless than 7 days\b|\bless than 7-days\b|\bless than a week\b|\bcouple of days\b/;
        var severe = /\bmore than 7 days\b|\bmore than 7-days\b|\bmore than a week\b|\bover a week\b/;

            if(mild.test(str)) {
                gi[key] = 'less than a day';
            }else if(moderate.test(str)) {
                gi[key] = 'less than a week';
                giScore++;
                console.log("the score is " + giScore);
            }else if(severe.test(str)) {
                gi[key] = 'more than a week';
                giScore+=2;
                console.log("the score is " + giScore);
            }else{
                throw new Error('noMatch');
            }

            return true;
    }
    function getBowelPeriod(str, key) { //red

        var mild = /\bless than a day\b|\b24-hours ago\b|\ba day\b|\ba day ago\b|\bless than 1 day\b/;
        var moderate = /\b1 to 3 days ago\b|\bcouple of days ago\b/;
        var severe = /\bover 3 days\b|\bover 3 days ago\b|\b3 days ago\b/;

            if(mild.test(str)) {
                console.log('I heard the correct phrase!', str );
                gi[key] = 'a day ago';
            }else if(moderate.test(str)) {
                gi[key] = 'couple of days ago';
                console.log('I heard the correct phrase!', str );
                giScore++;
                console.log("the giscore is " + giScore);
            }else if(severe.test(str)) {
                gi[key]= 'over 3 days';
                console.log('I heard the correct phrase!', str );
                giScore+=2;
                console.log("the giscore is " + giScore);
            }else{
                console.log('That didn\'t sound right.');
                throw new Error('noMatch');
            }
    }

//....dirrahoea
    function getHowManyBowel(str, key) { //red

        var mild = /\b1 to 3\b|\b123\b|\b1\b|\b2\b|\b3\b/;
        var moderate = /\b4 to 6\b|\b426\b|\b4\b|\b5\b|\b6\b/;
        var severe = /\bmore than 6\b|\bover 6\b|\b7\b|\b8\b|\b9\b|\b10\b/;

            if(mild.test(str)) {
                console.log('I heard the correct phrase!', str );
                gi[key] = '1 to 3';
            }else if(moderate.test(str)) {
                console.log('I heard the correct phrase!', str );
                gi[key] = '4 to 6';
                giScore++;
                console.log("the giscore is " + giScore);
            }else if(severe.test(str)) {
                console.log('I heard the correct phrase!', str );
                gi[key] = 'over 6';
                giScore+=2;
                console.log("the giscore is " + giScore);
            }else{
                console.log('That didn\'t sound right.');
                throw new Error('noMatch');
            }
    }

//.....abdominal


    function getSuddenGradual(str, key) { //red

        var mild = /\bgradual\b|\bgradually\b|\bslowly\b/;
        var moderate = /\bsudden\b|\bsuddenly\b|\bout of the blue\b|\binstantly\b/;
       // var severe = /\bside\b|\bover\b/;

            if(mild.test(str)) {
                gi[key] = 'gradual';
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                gi[key] = 'sudden';
                giScore++;
                console.log("the giscore is " + giScore);
                console.log('I heard the correct phrase!', str );
            }else{
                console.log('That didn\'t sound right.');
                throw 'noMatch';
            }
    }

    function getHowSevere(str, key) { //red

        var mild = /\b123\b|\blower than 4\b|\b1 to 3\b|\b1\b|\b2\b|\b3\b/;
        var moderate = /\b427\b|\bbetween 4 and 7\b|\b3 to 7\b|\b4\b|\b5\b|\b6\b|\b7\b/;
        var severe = /\b8210\b|\bover 8\b|\bbetween 8 and 10\b|\b8\b|\b9|\b10\b/;

            if(mild.test(str)) {
                gi[key] = '1 to 3'; 
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                gi[key] = '3 to 7';
                giScore++;
                console.log("the giscore is " + giScore);
                console.log('I heard the correct phrase!', str );
            }else if(severe.test(str)) {
                gi[key] = 'over 7';
                giScore+=2;
                console.log("the giscore is " + giScore);
                console.log('I heard the correct phrase!', str );
            }else{
                console.log('That didn\'t sound right.');
                throw 'noMatch';
            }
    }

    function getSharpDull(str, key) { //red

        var mild = /\bdull\b/;
        var moderate = /\bSharp\b|\bsharp\b/;
  

            if(mild.test(str)) {
                gi[key] = 'dull';
                console.log('I heard the correct phrase!', str );
            }else if(moderate.test(str)) {
                gi[key] = 'sharp';
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
            gi[key] = 'yes';
            console.log('I heard the correct phrase!', str );
            console.log("the score is " + giScore);
        } else if(conditionsTwo.test(str)){
            gi[key] = 'no';
            giScore++;
            console.log('I heard the correct phrase!', str );
            console.log("the giScore is " + giScore);
        }else{
            console.log('That didn\'t sound right.');
            throw new Error('noMatch');
        }
    }

    //document answer 
    function docGiAnswers(str, key) {
        console.log('this will document grey answers ', str);
        gi[key] = str;
    }

    function getSinusScore() {
        console.log('the basescore is ', sinusScore);
        sinuses.severity_result = sinusScore;
        sinuses.comparative_score = sinusScore-accounts.sinus_basescore;
    }

    function getChestScore() {
        console.log('the basescore is ', chestScore);
        chest.severity_result = chestScore;
        chest.comparative_score = chestScore-accounts.chest_basescore;
    }

    function getGiScore() {
        console.log('the basescore is ', giScore);
        gi.severity_result = giScore;
        gi.comparative_score = giScore-accounts.gi_basescore;
    }


//////////////////////////////start talking////////////////////////////


    $scope.startScript = function () {
        $scope.moveToNextItem("start");
        // recordService.audioChunks = [];
        // recordService.start();
        $scope.showStart = false;
        $scope.hidePlay = true;
        $scope.showRefresh = true;
        $scope.showReason = true;
        $scope.showReason = true;
        $scope.showRepeat = true;
        // console.log("recorder started");
    }    
 

    $scope.endScript = function () {
        location.replace("xxxx")
    }

    $scope.reloadPage = function () {
        location.reload()
    }

////////////////get actions when finished talking/////////////////////


    $scope.finishedTalking = function () {
        textContent = " ";

        function listenForReasons() {
            if ($scope.line.id === "start")  {
                speechService.start()
                    .then(function(result){
                        getReasons(result);
                        $scope.showRepeat = false;
                    })
                    .catch(function() {
                        return $scope.moveToNextItem("noMatch")
                    })
                }  
        }

        $scope.restartReasons = function () {
            speechService.start()
                .then(function(result){
                    getReasons(result);
                    $scope.showRepeat = false;
                })
                .catch(function() {
                    return $scope.moveToNextItem("noReasonMatch")
                })
            }


//.................first branch...............//

        function MovetoReason() { 
            if ($scope.line.id === "sinuses") {
                $scope.moveToNextQuestion(sinusQuestions.period)
                .then(() => listenForAnswers(sinusQuestions.period));
            }else if ($scope.line.id ===  "chest pain"){
                $scope.showChest = true;
                $scope.showChestRepeat = true;
                $scope.moveToNextQuestion(chestQuestions.chest)
                .then(() => listenForChestReasons())
            }else if ($scope.line.id ===  "gastrointestinal"){
                $scope.showGi = true;
                $scope.showGiRepeat = true;
                $scope.moveToNextQuestion(giQuestions.gi)
                 .then(() => listenForGiReasons())
            }else if ($scope.line.id ===  "other"){
                // $scope.moveToNextQuestion(obQuestions.spirometer)
                //     .then(() => listenForSpirometerAnswers(obQuestions.spirometer));
                $scope.moveToNextQuestion(chestQuestions.fever) 
                .then(() => listenForAdditionalAnswers(chestQuestions.fever));; 
            }else if ($scope.line.id ===  "no"){
                $scope.moveToNextQuestion(chestQuestions.fever) 
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
                                return getPeriodAnswers(result, sinusKey);
                            case 'cough':
                            case 'add_treatment':
                                return docSinusAnswers(result, sinusKey);
                            case 'other_symp':
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
                            getSinusScore();
                            $scope.moveToNextQuestion(endQuestions.end_sinus)
                            //at the end of questions update the DB
                            $scope.showRepeat = true;
                            return  patientService.sinuses(patientId, sinuses)
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
                    $scope.showCough = true;
                    $scope.showChestRepeat = false;
                    getChestReasons(result);
                })
                .catch(function() {
                    return $scope.moveToNextItem("noChestMatch")
                })
            }); 
        }

        $scope.restartChestReasons = function () {
            speechService.start()
                .then(function(result){
                    $scope.showChestRepeat = false;
                    getChestReasons(result);
                })
                .catch(function() {
                    return $scope.moveToNextItem("noChestMatch")
                })
            }

        function MovetoChestReason() { 
            if ($scope.line.id === "cough"){
                $scope.showChest = false;
                $scope.moveToNextQuestion(chestQuestions.ordinarily)
                  .then(() => listenChangeFlow(chestQuestions.ordinarily));
            }else if ($scope.line.id ===  "shortness of breath"){
                $scope.showChest = false;
                $scope.moveToNextQuestion(chestQuestions.breath_different) 
                .then(() => listenForBreathAnswers(chestQuestions.breath_different));
            }else if ($scope.line.id ===  "blood in sputum"){
                $scope.showChest = false;
                $scope.moveToNextQuestion(chestQuestions.red_flag_one) 
                .then(() => listenForBloodAnswers(chestQuestions.red_flag_one));
            }else if ($scope.line.id ===  "chest discomfort"){
                $scope.showChest = false;
                $scope.moveToNextQuestion(chestQuestions.chest_period) 
                .then(() => listenForChestAnswers(chestQuestions.chest_period));
            }else if ($scope.line.id ===  "additional"){
                $scope.showChest = false;
                $scope.moveToNextQuestion(chestQuestions.fever) 
                .then(() => listenForAdditionalAnswers(chestQuestions.fever));
            }else if ($scope.line.id ===  "none"){
                $scope.showRepeat = true;
                $scope.moveToNextQuestion(endQuestions.end_chest)
                .then(() => listenForEndReasons());
            }
        }


//...........cough questions within chest.....................................
       
        function listenChangeFlow(chestQuestion) {
            const coughKey = chestQuestion.id;
                $scope.audio.addEventListener('ended', () => {
                    speechService.start()
                    .then(function(result){
                        switch (coughKey) {
                            case 'ordinarily':
                                switch (true) {
                                    case conditionsOne.test(result):
                                        console.log('I heard the correct phrase!', result);
                                        $scope.moveToNextQuestion(chestQuestions.different)
                                        .then(() => listenForCoughAnswers(chestQuestions.different));
                                        break;
                                    case conditionsTwo.test(result):
                                        console.log('I heard the correct phrase!',result);
                                        $scope.moveToNextQuestion(chestQuestions.cough_period)
                                        .then(() => listenForCoughAnswers(chestQuestions.cough_period));
                                        break;
                                    default:
                                        $scope.moveToNextQuestion(chestQuestions.ordinarily)
                                        .then(() => listenChangeFlow(chestQuestions.ordinarily));
                                    }
                                }
                            });
                        });

                       
        }

        function listenForCoughAnswers(chestQuestion) {
        

            const coughKey = chestQuestion.id;
                $scope.audio.addEventListener('ended', () => {
                    speechService.start()
                    .then(function(result){
                        switch (coughKey) {
                            // LOOK TO CHANGE FLOW HERE
                            case 'cough_period':
                                return getChestPeriodAnswers(result, coughKey);;
                            case 'colour':
                                return getDifColour(result, coughKey);
                            case 'difColour':
                                return docChestAnswers(result, coughKey);
                            case 'much':
                                return getAmount(result, coughKey);
                            case 'easily':
                                return getChestNoIncrementAnswer(result, coughKey);
                            case 'blood':
                                return getChestYesNoAnswer(result, coughKey);
                            case 'better':
                                return getBetter(result, coughKey);
                            case 'add_cough_treatment':
                                return docChestAnswers(result, coughKey);
                            case 'other_cough_symp':
                                return docChestAnswers(result, coughKey);
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

                        if (nextQuestionIndex === 13) {
                            console.log("end Cough branch")
                            getChestScore()
                            $scope.showChestRepeat = true;
                            $scope.moveToNextQuestion(endQuestions.end_cough_branch)
                            return  patientService.cough(patientId, chest)
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
                            case 'breath_period':
                                return getChestPeriodAnswers(result, breathKey);;
                            case 'sudden':
                                return getChestSuddenGradual(result, breathKey);
                            case 'affected':
                                return getMildSevere(result, breathKey);
                            case 'tightness':
                            case 'breath_add_treatment':
                                return docChestAnswers(result, breathKey);
                            case 'breath_other_symp':
                            return docChestAnswers(result, breathKey);
                            default:
                                return getChestYesNoAnswer(result, breathKey);
                            }
                    })
                    .then(() => {
                        const nextQuestionIndex = chestQuestionKeys.findIndex((question) => {
                            return question === chestQuestion.id
                        });

                        // If we have asked all sinus questions then break the loop and send info to DB

                        if (nextQuestionIndex === 22) {
                            console.log("end breath branch")
                            getChestScore()
                            $scope.showChestRepeat = true;
                            $scope.moveToNextQuestion(endQuestions.end_breath_branch)
                            return  patientService.breath(patientId, chest)
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
                            case 'red_flag_one':
                                //RED FLAG ADD WARNING LARGE NUMBER
                                return getRedFlagAnswer(result, bloodKey);
                            case 'amount':
                                return getAmount(result, bloodKey);
                            case 'period':
                                return getHowManyTimes(result, bloodKey);
                            case 'unwell':
                            case 'blood_other_symp':
                                return docChestAnswers(result, bloodKey);
                            default:
                                return getChestYesNoAnswer(result, bloodKey);
                            }
                    })
                    .then(() => {
                        const nextQuestionIndex = chestQuestionKeys.findIndex((question) => {
                            return question === chestQuestion.id
                        });

                        // If we have asked all sinus questions then break the loop and send info to DB

                        if (nextQuestionIndex === 28) {
                            console.log("end blood branch")
                            getChestScore()
                            $scope.showChestRepeat = true;
                            $scope.moveToNextQuestion(endQuestions.end_blood_branch)
                            return  patientService.blood(patientId, chest)
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
                            case 'chest_period':
                                return getChestPeriodAnswers(result, chestKey);
                            case 'start':  
                                return getChestSuddenGradual(result, chestKey);
                            case 'red_flag_two':
                                return getRedFlagAnswer(result, chestKey);
                            case 'what':
                                return docChestAnswers(result, chestKey);
                            default:
                                return getChestYesNoAnswer(result, chestKey);
                            }
                    })
                    .then(() => {
                        const nextQuestionIndex = chestQuestionKeys.findIndex((question) => {
                            return question === chestQuestion.id
                        });

                        // If we have asked all sinus questions then break the loop and send info to DB

                        if (nextQuestionIndex === 33) {
                            $scope.moveToNextQuestion(chestQuestions.time) 
                            console.log("end breath branch")
                            return  patientService.discomfort(patientId, chest)
                            .then(() => {
                                return listenbranchFlow(chestQuestions.time)
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

        function listenbranchFlow(chestQuestion) {
            const coughKey = chestQuestion.id;
                $scope.audio.addEventListener('ended', () => {
                    speechService.start()
                    .then(function(result){
                        switch (coughKey) {
                            case 'time':
                                switch (true) {
                                    case conditionsOne.test(result):
                                        chest.time = "yes";
                                        console.log('I heard the correct phrase!', result);
                                        $scope.moveToNextQuestion(chestQuestions.chest_worse)
                                        .then(() => listenForlastChestAnswers(chestQuestions.chest_worse));
                                        break;
                                    case conditionsTwo.test(result):
                                        chest.time = "No";
                                        console.log('I heard the correct phrase!',result);
                                        $scope.moveToNextQuestion(branchQuestions.sometimes)
                                        .then(() => listenChestChangeFlow(branchQuestions.sometimes));
                                        break;
                                    default:
                                        $scope.moveToNextQuestion(chestQuestions.time) 
                                        .then(() => listenbranchFlow(chestQuestions.time));
                                    }
                                }
                            });
                        });
        }

        function listenChestChangeFlow(branchQuestion) {
            const branchKey = branchQuestion.id;
                $scope.audio.addEventListener('ended', () => {
                    speechService.start()
                    .then(function(result){
                        switch (branchKey) {
                            case 'sometimes':
                                docChestAnswers(result, branchKey);
                                $scope.moveToNextQuestion(branchQuestions.often)
                                .then(() => listenChestChangeFlow(branchQuestions.often));
                                break;
                            case 'often':
                                docChestAnswers(result, branchKey);
                                $scope.moveToNextQuestion(chestQuestions.chest_worse)
                                .then(() => listenForlastChestAnswers(chestQuestions.chest_worse));
                                break;
                            default:
                                return docChestAnswers(result, branchKey);
                                }
                            });
                        });
        }

        function listenForlastChestAnswers(chestQuestion) {
            const chestKey = chestQuestion.id;
                $scope.audio.addEventListener('ended', () => {
                    speechService.start()
                    .then(function(result){
                        switch (chestKey) {
                            case 'chest_worse':
                                return getChestYesNoAnswer(result, chestKey);
                            case 'shortness_of_breath':
                            case 'chest_other_symp':
                            return docChestAnswers(result, chestKey);
                            default:
                                return getChestYesNoAnswer(result, chestKey);
                            }
                    })
                    .then(() => {
                        const nextQuestionIndex = chestQuestionKeys.findIndex((question) => {
                            return question === chestQuestion.id
                        });

                        // If we have asked all sinus questions then break the loop and send info to DB

                        if (nextQuestionIndex === 39) {
                            console.log("end breath branch")
                            getChestScore()
                            $scope.showChestRepeat = true;
                            $scope.moveToNextQuestion(endQuestions.end_discomfort_branch)
                            return  patientService.discomfort(patientId, chest)
                            .then(() => {
                            return listenForChestReasons()
                        })
                        }
                        //increment index to move to next question
                        const nextQuestion = chestQuestions[chestQuestionKeys[nextQuestionIndex + 1]];
                        return $scope.moveToNextQuestion(nextQuestion)
                            .then(() => {
                                return listenForlastChestAnswers(nextQuestion);
                            }); // Loops back through this function
                    })

                    //if error repeat question
                    .catch(function() {
                        return $scope.moveToNextQuestion(chestQuestion)
                        .then(() => listenForlastChestAnswers(chestQuestion)); // Ask question again
                    })
                });
        }



////////////////////MOVE TO GI QUESTIONS////////////////////////////

        function listenForGiReasons() {
            $scope.audio.addEventListener('ended', () =>{
                speechService.start()
                .then(function(result){
                    getGiReasons(result);
                    $scope.showGiRepeat = false;
                })
                .catch(function() {
                    return $scope.moveToNextItem("noGiMatch")
                })
            }); 
        }

        $scope.restartGiReasons = function () {
            speechService.start()
                .then(function(result){
                    getGiReasons(result);
                    $scope.showGiRepeat = false;
                })
                .catch(function() {
                    return $scope.moveToNextItem("noGiMatch")
                })
            }
        //.................first gi branch...............//

        function MovetoGiReason() { 
            if ($scope.line.id === "constipation") {
                $scope.showGi = false;
                $scope.moveToNextQuestion(giQuestions.constipation_period)
                .then(() => listenForConstipationAnswers(giQuestions.constipation_period));
            }else if ($scope.line.id ===  "diarrhoea"){
                $scope.showGi = false;
                $scope.moveToNextQuestion(giQuestions.diarrhoea_period) 
                .then(() => listenForDiarrhoeaAnswers(giQuestions.diarrhoea_period));
            }else if ($scope.line.id ===  "abdominal pain"){
                $scope.showGi = false;
                $scope.moveToNextQuestion(giQuestions.where)
                .then(() => listenForAbdominalAnswers(giQuestions.where)); 
            }else if ($scope.line.id ===  "vomiting"){
                $scope.showGi = false;
                $scope.moveToNextQuestion(giQuestions.when)
                .then(() => listenForVomitAnswers(giQuestions.when));
            }else if ($scope.line.id ===  "heartburn"){
                $scope.showGi = false;
                $scope.moveToNextQuestion(giQuestions.heartburn_period) 
                .then(() => listenForHeartburnAnswers(giQuestions.heartburn_period));
            }else if ($scope.line.id ===  "not"){
                $scope.showRepeat = true;
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
                            case 'constipation_period':
                                return getGiPeriodAnswers(result, ConstipationKey);
                            case 'constipation_bowel_motion':  
                                return getBowelPeriod(result, ConstipationKey);
                            case 'previous': 
                                return docGiAnswers(result, ConstipationKey);
                            case 'constipation_eating': 
                                return  getGiNoIncrementAnswer(result, ConstipationKey);
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
                            console.log("end breath branch")
                            getGiScore();
                            $scope.moveToNextQuestion(endQuestions.end_con_branch)  
                            $scope.showGiRepeat = true;                
                            return  patientService.constipation(patientId, gi)
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
                            case 'diarrhoea_period':
                                return getGiPeriodAnswers(result, diarrhoeaKey);
                            case 'diarrhoea_bowel_motion':  
                                return getHowManyBowel(result, diarrhoeaKey);
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
                            console.log("end breath branch")
                            getGiScore()
                            $scope.moveToNextQuestion(endQuestions.end_dia_branch)
                            $scope.showGiRepeat = true;
                            return  patientService.diarrhoea(patientId, gi)
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
                            case 'where':
                                return docGiAnswers(result, abKey);
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
                            console.log("end breath branch")
                            getGiScore();
                            $scope.moveToNextQuestion(endQuestions.end_ab_branch)
                            $scope.showGiRepeat = true;
                            return  patientService.abdominal(patientId, gi)
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

        //..............VOMIT QUESTIONS...................//

        function listenForVomitAnswers(giQuestion) {
            const vomitKey = giQuestion.id;
                $scope.audio.addEventListener('ended', () => {
                    speechService.start()
                    .then(function(result){
                        switch (vomitKey) {
                            case 'when':
                                return docGiAnswers(result, vomitKey);
                            default:
                                return docGiAnswers(result, vomitKey);
                            }
                    })
                    .then(() => {
                        const nextQuestionIndex = giQuestionKeys.findIndex((question) => {
                            return question === giQuestion.id
                        });
        
                        // If we have asked all sinus questions then break the loop and send info to DB
        
                        if (nextQuestionIndex === 37) {
                            console.log("end breath branch")
                            getGiScore();
                            $scope.moveToNextQuestion(endQuestions.end_vom_branch)
                            $scope.showGiRepeat = true;
                            return  patientService.vomit(patientId, gi)
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
                            case 'heartburn_period':
                                return docGiAnswers(result, heartburnKey);
                            default:
                                return docGiAnswers(result, heartburnKey);
                            }
                    })

                    .then(() => {
                        const nextQuestionIndex = giQuestionKeys.findIndex((question) => {
                            return question === giQuestion.id
                        });
        
                        // If we have asked all sinus questions then break the loop and send info to DB
        
                        if (nextQuestionIndex === giQuestionKeys.length - 1) {
                            console.log("end breath branch")
                            getGiScore();
                            $scope.moveToNextQuestion(endQuestions.end_heart_branch)
                            $scope.showGiRepeat = true;
                            return  patientService.heartburn(patientId, gi)
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

        //.................additional.................
      //THIS NEEDS TO BE ADD TO THE END OF EVERY SECTION
      function listenForAdditionalAnswers(chestQuestion) {
        const addKey = chestQuestion.id;
        $scope.audio.addEventListener('ended', () => {
            speechService.start()
            .then(function(result){
                switch (addKey) {
                    default:
                        return docChestAnswers(result, addKey);
                    }
            })

            .then(() => {
                const nextQuestionIndex = chestQuestionKeys.findIndex((question) => {
                    return question === chestQuestion.id
                });

                if (nextQuestionIndex === 44) {
                    getChestScore()
                    myobj.remove()
                    $scope.moveToNextQuestion(obQuestions.spirometer)
                    .then(() => listenForSpirometerAnswers(obQuestions.spirometer));
                    return patientService.additional(patientId, chest)
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

    function listenForEndReasons() {
        $scope.audio.addEventListener('ended', () => {
            speechService.start()
                 .then(function(result){
                    $scope.showRepeat = false;
                    getReasons(result);
                })
                .catch(function() {
                    return $scope.moveToNextItem("noReasonMatch")
                })
            })
        }

        //...............OBJECTIVE QUESTIONS............//

        //THIS NEEDS TO BE ADD TO THE END OF EVERY SECTION
        function listenForSpirometerAnswers(obQuestion, visemes) {
            document.getElementById("textBox").value = "";
            let yesBtn = document.getElementById("yesBtn");
            $scope.showSNoBtn = true;
            $scope.showYesBtn = true;

            $scope.startSpiroScript = function () {
                yesBtn.remove()
                $scope.showNextBtn = true;
                ob.spirometer_yes = "yes";
                $scope.audio.pause();
                
                return $scope.moveToNextQuestion(obQuestions.spirometer_location)
                .then(() => {
                    return listenForSpirometerAnswers(obQuestions.spirometer_location);
                });  
            }

            $scope.startAllSpiroScript = function () {
                $scope.showYesBtn = false;
                $scope.audio.pause();
               
                const nextQuestionIndex = obQuestionKeys.findIndex((question) => {
                    return question === obQuestion.id
                });

                if (nextQuestionIndex === 7) {
                    console.log("this is number 7")
                    $scope.showNotFin = true;
                    document.getElementById("sNoBtn").style.visibility = "hidden";
                }else if (nextQuestionIndex === 8){
                    $scope.showNotFin = false;
                }else if (nextQuestionIndex === 9){
                    $scope.showTextInput = true;
                }else if (nextQuestionIndex === 10){
                    $scope.showTextInput = false;
                    $scope.showSpirometerInput = false;
                    $scope.showNextBtn = false;
                    $scope.showCompleteBtn = true;
                    $scope.showNextBlowBtn = true;
                    arrayInputs()
                }

                const nextQuestion = obQuestions[obQuestionKeys[nextQuestionIndex + 1]];
                return $scope.moveToNextQuestion(nextQuestion)
                .then(() => {
                    return listenForSpirometerAnswers(nextQuestion);
                });  
            }

            $scope.notCompleteSpiro = function () {
                $scope.audio.pause();
                return $scope.moveToNextQuestion(obQuestions.nose_clip)
                .then(() => {
                    return listenForSpirometerAnswers(obQuestions.nose_clip);
                });  
            }

            $scope.nextBlow = function () {
                $scope.audio.pause();
                $scope.showCompleteBtn = false;
                $scope.showNextBlowBtn = false;
                $scope.showNextBtn = true;
                return $scope.moveToNextQuestion(obQuestions.spirometer_prepare)
                .then(() => {
                    return listenForSpirometerAnswers(obQuestions.spirometer_prepare);
                });  
            }

            $scope.completeSpiro = function () {
                $scope.audio.pause();
                $scope.showCompleteBtn = false;
                $scope.showNextBlowBtn = false;
                getHighestInput()
                return $scope.moveToNextQuestion(obQuestions.oxygen)
                .then(() => {
                    return listenForOxygenAnswers(obQuestions.oxygen)
                });  
            }
            
            $scope.startSpiroNoScript = function () {
                $scope.audio.pause();
                ob.spirometer_no = "no";
                return $scope.moveToNextQuestion(obQuestions.spirometer_no)
                .then(() => {
                    $scope.showTextInput = true;
                    $scope.showSpirometerInput = true;
                    $scope.showSNoBtn = false;
                    $scope.showNextBtn = false;
                    yesBtn.remove()
                });
                }

            $scope.getSpirometerInput = function (){ 
                $scope.audio.pause();
                var other = document.getElementById("textBox").value;
                $scope.showTextInput = false;
                $scope.showSpirometerInput = false;
                console.log(other);
                ob.spirometer_input = other;
                return $scope.moveToNextQuestion(obQuestions.oxygen)
                .then(() => {
                    return listenForOxygenAnswers(obQuestions.oxygen)
                })
            }
        }  

////////OXYGEN MEASURMENTS//////////

        function listenForOxygenAnswers(obQuestion){
            $scope.showONoBtn = true;
            $scope.showOxygenBtn = true; 
            $scope.showNextBtn = false;
            document.getElementById("textBox").value = ""; 
            var oxInput  = document.getElementById("textBox").value;

            $scope.startOxygenScript = function () {
                $scope.audio.pause();
                ob.oxygen_yes = "yes";
                document.getElementById("yesOBtn").style.visibility = "hidden";
                $scope.showOxygenNextBtn = true;
                return $scope.moveToNextQuestion(obQuestions.oxygen_location)
                .then(() => {
                    return listenForOxygenAnswers(obQuestions.oxygen_location);
                });
                }

                $scope.startAllOxygenScript = function () { 
                    $scope.audio.pause();   
                    const nextQuestionIndex = obQuestionKeys.findIndex((question) => {
                        return question === obQuestion.id
                    });
    
                    if (nextQuestionIndex === 17){
                        $scope.showTextInput = true;
                    }else if (nextQuestionIndex === 18){
                        $scope.showTextInput = false;
                        $scope.showOxygenNextBtn = false;
                        $scope.showCompleteOx = true;
                        $scope.showRepeatBtn = true;
                        document.getElementById("oNoBtn").style.visibility = "hidden"
                    }
    
                    const nextQuestion = obQuestions[obQuestionKeys[nextQuestionIndex + 1]];
                    return $scope.moveToNextQuestion(nextQuestion)
                    .then(() => {
                        return listenForOxygenAnswers(nextQuestion);
                    });  
                }
                
                $scope.repeatAssessment = function () {
                    $scope.audio.pause();
                    $scope.showCompleteOx = false;
                    $scope.showRepeatBtn = false;
                    $scope.showOxygenNextBtn = true;
                    return $scope.moveToNextQuestion(obQuestions.oxygen_equipment)
                    .then(() => {
                        return listenForOxygenAnswers(obQuestions.oxygen_equipment);
                    });  
                }

                $scope.completeOx = function () {
                    $scope.audio.pause();
                    $scope.showCompleteOx = false;
                    $scope.showRepeatBtn = false;
                    ob.oxygen_input = oxInput;
                    console.log(oxInput);
                    return $scope.moveToNextQuestion(obQuestions.temperature)
                    .then(() => {
                        return listenForTempAnswers(obQuestions.temperature)
                    });  
                }

            $scope.startOxygenNoScript = function () {
                $scope.audio.pause();
                ob.oxygen_no = "no";
                return $scope.moveToNextQuestion(obQuestions.oxygen_no)
                .then(() => {
                    $scope.showTextInput = true;
                    $scope.showOxygenInput = true;
                    $scope.showOxygenNextBtn = false;
                    $scope.showONoBtn = false;
                    $scope.showOxygenBtn = false;
                });
            }

            $scope.getOxygenInput = function (){
                $scope.audio.pause();
                var otherReason  = document.getElementById("textBox").value;
                $scope.showTextInput = false;
                $scope.showOxygenInput = false;
                ob.oxygen_input = otherReason;
                console.log( otherReason );
                return $scope.moveToNextQuestion(obQuestions.temperature)
                .then(() => {
                return listenForTempAnswers(obQuestions.temperature)
                })
            }
        }

/////////TEMPERATURE MEASURMENTS//////////////////////
            
        function listenForTempAnswers(obQuestion){
            $scope.showTNoBtn = true;
            $scope.showTempBtn = true;
            document.getElementById("textBox").value = ""; 
            var temp = document.getElementById("textBox").value;
            const nextQuestionIndex = obQuestionKeys.findIndex((question) => {
                return question === obQuestion.id
            });

            $scope.startTempScript = function () {
                $scope.audio.pause();
                ob.temperature_yes = "yes";
                if (nextQuestionIndex === 25){
                    $scope.showTextInput = true;
                }else if (nextQuestionIndex === 26){
                    $scope.showTextInput = false;
                    $scope.showCompleteT = true;
                    $scope.showRepeatTBtn = true;
                    document.getElementById("tNoBtn").style.visibility = "hidden"
                    document.getElementById("tBtn").style.visibility = "hidden"
                }
                const nextQuestion = obQuestions[obQuestionKeys[nextQuestionIndex + 1]];
                return $scope.moveToNextQuestion(nextQuestion)
                .then(() => {
                    return listenForTempAnswers(nextQuestion);
                });
                }

            $scope.repeatTAssessment = function () {
                $scope.audio.pause();
                $scope.showCompleteT = false;
                $scope.showRepeatTBtn = false;
                document.getElementById("tBtn").style.visibility = "visible"
                return $scope.moveToNextQuestion(obQuestions.temperature_prepare)
                .then(() => {
                    return listenForTempAnswers(obQuestions.temperature_prepare);
                });  
            }

            $scope.completeT = function () {
                $scope.audio.pause();
                $scope.showCompleteT = false;
                $scope.showRepeatTBtn = false;
                ob.temperature_input = temp;
                console.log( temp );
                if (temp >= 38){
                    obScore++;
                    ob.objective_score = obScore;
                    console.log(obScore);
                }
                return getFinalSentance();
            }


            $scope.startTempNoScript = function () {
                $scope.audio.pause();
                ob.temperature_no = "no";
                return $scope.moveToNextQuestion(obQuestions.temperature_no)
                .then(() => {
                    $scope.showTNoBtn = false;
                    $scope.showTempBtn = false;
                    $scope.showTextInput = true;
                    $scope.showTemperatureInput = true;
                });
                }

            $scope.getTemperatureInput = function (){
                $scope.audio.pause();
                var othertempReason  = document.getElementById("textBox").value;
                $scope.showTextInput = false;
                $scope.showOxygenInput = false;
                $scope.endVisit = true;
                $scope.bye = true;
                ob.objective_score = obScore;
                ob.temperature_input = othertempReason;
                return getFinalSentance();
            }  
        }

        ////functions for Calculating lung function////////////

        function arrayInputs(){
        let readings = document.getElementById("textBox").value;
        lfReadings.push(readings);
        console.log(lfReadings);
        }

        function getHighestInput(){
            const largest = Math.max.apply(Math, lfReadings);
            console.log("The largest number is " + largest);
            ob.spirometer_input = largest;
            getCalculation(largest)
        }

        function getCalculation(ltrs){
            var gender = accounts.gender;
            var age = accounts.age;
            var mtrs = accounts.height;

            if(gender == "m"){
                var result = (4.3*mtrs) - (0.029*age) - 2.49;
                predicted = (ltrs/result)*100;
                getLFScores(predicted);
                ob.spirometer_percentage = predicted;
                console.log(predicted);
            }else if(gender == "f"){
                var result = (3.95*mtrs) - (0.025*age) - 2.6;
                predicted = (ltrs/result)*100;
                getLFScores(predicted);
                ob.spirometer_percentage = predicted;
                console.log(predicted);
            }else{
                console.log("THIS DIDNT WORK");
                }
        }

        function getLFScores(predicted){
            var blf = accounts.blf;
            var diff = predicted - blf;
            console.log(diff);
            if(predicted > blf || diff >= -5 &&  diff <= 0){
                obScore++;
                console.log(obScore);
            }else if(diff >= -10 && diff < -5){
                obScore+=2;
                console.log(obScore);
            }else if(diff < -10){ 
                obScore+=3;
                console.log(obScore);
            }
        }

        function getFinalSentance(){
            patientService.objective(patientId, ob)
            // sendFileService.sendMail() 
            $scope.doctor = true;
            console.log(sinusScore, chestScore, giScore, obScore)

            switch (true){
        
                case obScore <= 1:
                    switch(true){
                        case sinusScore == 0 && chestScore == 0 && giScore == 0 && obScore == 0:
                        case chestScore > 0 && chestScore <= 5:
                        case giScore > 0 && giScore <= 9:
                            console.log("mild base score")
                            return $scope.moveToNextQuestion(endQuestions.end_mild)
                        case sinusScore > 0 && sinusScore <= 7:
                        case chestScore > 5 && chestScore <= 12:
                        case giScore > 9 && giScore <= 15:
                            console.log("moderate base score")
                            return $scope.moveToNextQuestion(endQuestions.end_moderate)
                        case chestScore > 12 && chestScore <= 20:
                        case giScore > 15:
                            console.log("severe base score")
                            return $scope.moveToNextQuestion(endQuestions.end_severe)
                        case chestScore >= 20:
                            console.log("urgent base score")
                            return $scope.moveToNextQuestion(endQuestions.end_urgent)
                        default:
                            return $scope.moveToNextQuestion(endQuestions.end_mild)
                    }
                 
                
                case obScore == 2:
                    switch(true){
                        case sinusScore > 0 && sinusScore <= 7:
                        case chestScore > 5 && chestScore <= 12:
                        case giScore > 9 && giScore <= 15:
                            console.log("moderate base score")
                            return $scope.moveToNextQuestion(endQuestions.end_moderate)
                        case chestScore > 12 && chestScore <= 20:
                        case giScore > 15:
                            console.log("severe base score")
                            return $scope.moveToNextQuestion(endQuestions.end_severe)
                        case chestScore >= 20:
                            console.log("urgent base score")
                            return $scope.moveToNextQuestion(endQuestions.end_urgent)
                        default:
                            return $scope.moveToNextQuestion(endQuestions.end_moderate)
                    }
              
                case obScore == 3:
                    switch(true){
                        case chestScore > 12 && chestScore <= 20:
                        case giScore > 15:
                            console.log("severe base score")
                            return $scope.moveToNextQuestion(endQuestions.end_severe)
                        case chestScore >= 20:
                            console.log("urgent base score")
                            return $scope.moveToNextQuestion(endQuestions.end_urgent)
                        default:
                            return $scope.moveToNextQuestion(endQuestions.end_severe)
                    }

                case obScore == 4:
                    switch(true){
                        case chestScore >= 20:
                            console.log("urgent base score")
                            return $scope.moveToNextQuestion(endQuestions.end_urgent)
                    }
                    break;
            }     
        }

//....................listen for other related questions....................

        function listenForNameError() {
            if ($scope.line.id === "noMatch") {
                speechService.start()
                .then(function(result){
                    getReasons(result)
                    $scope.showRepeat = false;
                }).catch(function(error) {
                    console.log(error);
                    $scope.moveToNextItem("noMatch")      
                });
            }
        }

        function listenForReasonError() {
            if ($scope.line.id === "noReasonMatch") {
                speechService.start()
                .then(function(result){
                    getReasons(result);
                    $scope.showRepeat = false;
                }).catch(function(error) {
                    console.log(error);
                    $scope.moveToNextItem("noReasonMatch")  
                });
            }
        }

        function listenForChestError() {
            if ($scope.line.id === "noChestMatch") {
                speechService.start()
                .then(function(result){
                    getChestReasons(result);
                    $scope.showChestRepeat = false;
                }).catch(function(error) {
                    console.log(error);
                    $scope.moveToNextItem("noChestMatch")  
                });
            }
        }

        function listenForGiError() {
            if ($scope.line.id === "noGiMatch") {
                speechService.start()
                .then(function(result){
                    getGiReasons(result);
                    $scope.showGiRepeat = false;
                }).catch(function(error) {
                    $scope.moveToNextItem("noGiMatch")  
                    console.log(error);
                });
            }
        }

       
        listenForReasons();
        MovetoReason();
        MovetoChestReason();
        MovetoGiReason();
        listenForNameError();
        listenForReasonError()
        listenForChestError()
        listenForGiError()
    }
    
//Functions to move to next question and get animations and audio for each question///////

//Move to next question in scripted
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

    //Move to next question in DB
    $scope.moveToNextQuestion = function(question) {
        console.log("Got", question);
        return scriptService.getVisemes(question.speechid)
        .then(function (visemes) {
            $scope.data.guide = question.guide;
            $scope.data.images = question.images;
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


