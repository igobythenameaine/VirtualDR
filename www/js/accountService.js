app.service("accountService", function ($http, $q) {
    
    this.getPatient = function (id) {
        var deferred = $q.defer();

        $http.post('/patient/' + id).then(function (d) {
            deferred.resolve(d.data);      
        })

        return deferred.promise;
    }
});
