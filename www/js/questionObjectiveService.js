//get all end questions form server 

app.service("questionObjectiveService", function ($http, $q) {
    this.getAll = function () {
        var deferred = $q.defer();

        $http.get('/objective-questions').then(function (d) {
            deferred.resolve(d.data);
        })

        return deferred.promise;
    }
});
