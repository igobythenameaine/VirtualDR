app.service("questionChestService", function ($http, $q) {
   
    // get questions from database
    this.getAll = function () {
        var deferred = $q.defer();

        $http.get('/chest-question').then(function (d) {
            deferred.resolve(d.data);
        })
        
        return deferred.promise;
    }
});
