//get all sinus questions form server 

app.service("questionSinusService", function ($http, $q) {
    this.getAll = function () {
        var deferred = $q.defer();

        $http.get('/sinus-questions').then(function (d) {
            deferred.resolve(d.data);
        })

        return deferred.promise;
    }
});
