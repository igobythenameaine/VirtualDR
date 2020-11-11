//get all gi questions form server 

app.service("questionGiService", function ($http, $q) {
    //get question from DB
    this.getAll = function () {
        var deferred = $q.defer();

        $http.get('/gi-questions').then(function (d) {
            deferred.resolve(d.data);
        })

        return deferred.promise;
    }
});
