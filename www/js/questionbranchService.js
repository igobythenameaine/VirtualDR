//get all end questions form server 

app.service("questionbranchService", function ($http, $q) {
    this.getAll = function () {
        var deferred = $q.defer();

        $http.get('/branch-questions').then(function (d) {
            deferred.resolve(d.data);
        })

        return deferred.promise;
    }
});
