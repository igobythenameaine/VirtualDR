app.service("textFileService", function ($http, $q) {
    console.log($http);

    this.textFile = function() {
        var deferred = $q.defer();

        $http.post('/text-file/').then(function (d) {
            deferred.resolve(d.data);
          
        })

        return deferred.promise;
    }
});