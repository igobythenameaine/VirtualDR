//get all end questions form server 

app.service("questionEndService", function ($http, $q) {
    this.getAll = function () {
        var deferred = $q.defer();

        $http.get('/end-questions').then(function (d) {
            deferred.resolve(d.data);
        })

        return deferred.promise;
    }
});
