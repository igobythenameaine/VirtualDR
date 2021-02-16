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

    this.diarrhoea = function (id, diarrhoea) {
        var deferred = $q.defer();

        $http.post('/diarrhoea/' + id, diarrhoea).then(function (d) {
            deferred.resolve(d.data);
          
        })

        return deferred.promise;
    }

    this.abdominal = function (id, abdominal) {
        var deferred = $q.defer();

        $http.post('/abdominal/' + id, abdominal).then(function (d) {
            deferred.resolve(d.data);
          
        })

        return deferred.promise;
    }

    this.vomit = function (id, vomit) {
        var deferred = $q.defer();

        $http.post('/vomit/' + id, vomit).then(function (d) {
            deferred.resolve(d.data);
          
        })

        return deferred.promise;
    }

    this.heartburn = function (id, heartburn) {
        var deferred = $q.defer();

        $http.post('/heartburn/' + id, heartburn).then(function (d) {
            deferred.resolve(d.data);
          
        })

        return deferred.promise;
    }

    this.cough = function (id, cough) {
        var deferred = $q.defer();

        $http.post('/cough/' + id, cough).then(function (d) {
            deferred.resolve(d.data);
          
        })

        return deferred.promise;
    }

    this.breath = function (id, breath) {
        var deferred = $q.defer();

        $http.post('/breath/' + id, breath).then(function (d) {
            deferred.resolve(d.data);
          
        })

        return deferred.promise;
    }

    this.blood = function (id, blood) {
        var deferred = $q.defer();

        $http.post('/blood/' + id, blood).then(function (d) {
            deferred.resolve(d.data);
          
        })

        return deferred.promise;
    }

    this.discomfort = function (id, discomfort) {
        var deferred = $q.defer();

        $http.post('/discomfort/' + id, discomfort).then(function (d) {
            deferred.resolve(d.data);
          
        })

        return deferred.promise;
    }

    this.additional = function (id, additional) {
        var deferred = $q.defer();

        $http.post('/additional/' + id, additional).then(function (d) {
            deferred.resolve(d.data);
          
        })

        return deferred.promise;
    }


    this.objective = function (id, objective) {
        var deferred = $q.defer();

        $http.post('/objective/' + id,objective).then(function (d) {
            deferred.resolve(d.data);
            
        })

        return deferred.promise;
    }


});