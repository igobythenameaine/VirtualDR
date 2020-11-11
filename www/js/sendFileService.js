app.service("sendFileService", function ($http, $q) {
    console.log($http);

    this.sendMail = function() {
        var deferred = $q.defer();

        $http.post('/send-mail/').then(function (d) {
            deferred.resolve(d.data);
          
        })

        return deferred.promise;
    }
});