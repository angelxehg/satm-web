
var synth = angular.module('synth');

synth.factory('daemon', function ($rootScope, $window, $interval, trigger, shttp) {

    var token = "";

    var status = {
        logged: false,
        admin: false,
        current: null,
        progress: 0,
        mistakes: {}
    };

    function load() {
        token = $window.sessionStorage.getItem('token');
        if (token != null) {
            shttp.setAUTH(token);
            status.logged = true;
            trigger.common.onSucess("Sesión cargada desde caché");
            persist()
            daemon();
        } else {
            trigger.daemon.onNoLogged();
        }
        $interval(daemon, 15000);
    };

    function persist() {
        $window.sessionStorage.setItem('token', token);
    };

    function purge() {
        shttp.setAUTH("");
        status.logged = false;
        status.admin = false;
        $window.sessionStorage.removeItem('token');
        trigger.daemon.onSessionDestroyed();
    }

    function daemon() {
        if (status.logged) {
            var subUrl = "/synth";
            function onSuccess(response) {
                status.admin = response.data.isAdmin;
                status.current = response.data.current;
                trigger.daemon.onDaemon(response);
                persist();
            }
            function onError(response) {
                if (response.data.error) {
                    purge();
                    trigger.session.onLogoutSucess();
                } else {
                    trigger.shttp.onError(response);
                }
            }
            shttp.get(subUrl, null, onSuccess, onError);
        }
    }

    function login(object) {
        var subUrl = "/auth/login";
        trigger.session.onLogin();
        function onSuccess(response) {
            if (response.data) {
                token = "Bearer " + response.data.access_token;
                status.current = response.data.current;
                shttp.setAUTH(token);
                persist(); // SAVE
                trigger.daemon.onWaterFall();
            }
        }
        function onError(response) {
            if (response.data.message != undefined) {
                trigger.session.onLoginError(response.data.message);
            } else {
                trigger.common.onConnecionError();
            }
        }
        shttp.post(subUrl, object, onSuccess, onError);
    }

    function logout() {
        var subUrl = "/auth/logout";
        trigger.session.onLogout();
        function onSuccess() {
            purge();
            trigger.session.onLogoutSucess();
        }
        shttp.post(subUrl, null, onSuccess);
    }

    var public = {
        status: status,
        load: load,
        login: login,
        logout: logout
    }

    return public;

});
