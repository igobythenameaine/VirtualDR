app.service("patientService", function ($http, $q) {


    this.sinuses = function (id, sinus) {
        var deferred = $q.defer();

        $http.post('/sinus/' + id, sinus).then(function (d) {
            deferred.resolve(d.data);
          
        })

        return deferred.promise;
    }

    this.constipation = function (id, constipation) {
        var deferred = $q.defer();

        $http.post('/constipation/' + id, constipation).then(function (d) {
            deferred.resolve(d.data);
          
        })

        return deferred.promise;
    }
});