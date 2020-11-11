//source code from https://medium.com/jeremy-gottfrieds-tech-blog/javascript-tutorial-record-audio-and-encode-it-to-mp3-2eedcd466e78
//record visit to virtual doctor

app.service("recordService", function ($http) {

      if (navigator.getUserMedia) {

        navigator.mediaDevices.getUserMedia({audio:true}).then(stream => {
            
            console.log("getUserMedia supported");

            rec = new MediaRecorder(stream); 

            rec.ondataavailable = e => { 
                audioChunks.push(e.data);
                if (rec.state == "inactive"){

                    let blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
                    console.log(blob)

                    // execute a function to send your blob to your server.    
                    function uploadFile($http, data) {

                        var fd = new FormData();
                        fd.append('file', data, 'test-filename');
                    
                        $http.post("/", fd, {
                            withCredentials: false,
                            headers: {
                              'Content-Type': undefined
                            },
                            transformRequest: angular.identity,
                            params: {
                              fd
                            },
                            responseType: "arraybuffer"
                          })
                          .then(function(response) {
                            var data = response.data;
                            var status = response.status;
                            console.log(data);
                    
                            // if (status == 200 || status == 202) //do whatever in success
                            // else // handle error in  else if needed 
                          })
                          .catch(function(error) {
                            console.log(error.status);
                    
                            // handle else calls
                          });
                    }
                    
            recordedAudio.src = URL.createObjectURL(blob);
            recordedAudio.controls=false;
            recordedAudio.autoplay=false;
            uploadFile($http, blob);
            }
        }

        this.start = function() {
            audioChunks = [];
            rec.start();
        }
        
        this.stop = function() {
            rec.stop();
        }

    })
    .catch(e=>console.log(e));
    }

});