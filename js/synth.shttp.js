
var synth = angular.module('synth');

synth.factory('shttp', function ($http, trigger) {

    var apiURL = "";
    var authToken = "";

    function setURL(url) {
        apiURL = url;
    }

    function setAUTH(token) {
        authToken = token;
    }

    function request(method, subURL, data = null, onSucess = trigger.shttp.onSucess, onError = trigger.shttp.onError) {
        var headers = { 'Authorization': authToken };
        // if (method == "PUT") {
        //     headers = { 'Authorization': authToken, 'Content-Type': 'application/x-www-form-urlencoded' };
        // }
        var request = $http({
            method: method,
            data: data,
            headers: headers,
            url: apiURL + subURL
        }).then(
            function sucess(response) { onSucess(response); },
            function error(response) { onError(response); }
        );
        1 == 1;
    }

    function prototypeRequest(type) {
        return function (subURL, object = null, onSucess = trigger.shttp.onSucess, onError = trigger.shttp.onError) {
            request(type, subURL, object, onSucess, onError);
        }
    }

    var public = {
        setURL: setURL,
        setAUTH: setAUTH,
        get: prototypeRequest("GET"),
        post: prototypeRequest("POST"),
        put: prototypeRequest("PUT"),
        delete: prototypeRequest("DELETE")
    }

    return public;

});
