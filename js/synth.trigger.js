
var synth = angular.module('synth');

synth.factory('trigger', function ($log) {

    function snackOnPerforming(message) {
        Snackbar.show({
            text: message,
            showAction: false,
        });
    }

    function snackOnSucess(message) {
        Snackbar.show({
            text: message,
            showAction: true,
            actionText: "OK"
        });
    }

    function snackOnError(message) {
        Snackbar.show({
            text: message,
            showAction: true,
            actionText: "OK"
        });
    }

    var shttp = {
        onSucess: function (response) {
            $log.info("Sucessful request!");
            snackOnSucess(response.data.message);
        },
        onError: function (response) {
            $log.warn("Erroneous request!");
            snackOnSucess("Error " + response.status);
        }
    }

    var common = {
        onSucess: function (message) {
            $log.info(message);
        },
        onError: function (message) {
            $log.error(message);
        },
        onConnecionError: function () {
            snackOnError('Error de conexión');
        }
    }

    var daemon = {
        onSessionDestroyed: function () {
            $log.warn("Destroyed session");
        },
        onWaterFall: function () {
            $log.warn("Waterfall!");
        },
        onNoLogged: function () {
            $log.warn("Not logged in!");
        },
        onDaemon: function () {
            $log.info("Daemon executed!");
        }
    }

    var session = {
        onLogin: function () {
            snackOnPerforming('Iniciando sesión...');
        },
        onLogout: function () {
            snackOnPerforming('Cerrando sesión...');
        },
        onLoginSucess: function () {
            snackOnSucess('Inicio de sesión correcto');
        },
        onLogoutSucess: function () {
            snackOnSucess('Se cerró la sesión');
        },
        onLoginError: function (message) {
            snackOnError(message);
        }
    }

    var sources = {
        machines: {
            onNew: function () {
                snackOnPerforming('Creando equipo...');
            },
            onNewCreated: function () {
                snackOnSucess('Equipo creado!');
                $('#machineModal').modal('hide');
            },
            onNewCreatedError: function (message) {
                snackOnError(message);
            },
            onUpdate: function () {
                snackOnPerforming('Actualizando equipo...');
            },
            onUpdated: function () {
                snackOnSucess('Equipo actualizado!');
                $('#machineModal').modal('hide');
            },
            onUpdatedError: function (message) {
                snackOnError(message);
            },
            onDelete: function () {
                snackOnPerforming('Eliminando equipo...');
            },
            onDeleted: function () {
                snackOnSucess('Equipo eliminado!');
                $('#machineModal').modal('hide');
            },
            onDeletedError: function (message) {
                snackOnError(message);
            }
        },
        components: {
            onNew: function () {
                snackOnPerforming('Creando componente...');
            },
            onNewCreated: function () {
                snackOnSucess('Componente creado!');
                $('#componentModal').modal('hide');
            },
            onNewCreatedError: function (message) {
                snackOnError(message);
            },
            onUpdate: function () {
                snackOnPerforming('Actualizando componente...');
            },
            onUpdated: function () {
                snackOnSucess('Componente actualizado!');
                $('#componentModal').modal('hide');
            },
            onUpdatedError: function (message) {
                snackOnError(message);
            },
            onDelete: function () {
                snackOnPerforming('Eliminando componente...');
            },
            onDeleted: function () {
                snackOnSucess('Componente eliminado!');
                $('#componentModal').modal('hide');
            },
            onDeletedError: function (message) {
                snackOnError(message);
            }
        },
        users: {
            onNew: function () {
                snackOnPerforming('Creando usuario...');
            },
            onNewCreated: function () {
                snackOnSucess('Usuario creado!');
                $('#userModal').modal('hide');
            },
            onNewCreatedError: function (message) {
                snackOnError(message);
            },
            onUpdate: function () {
                snackOnPerforming('Actualizando usuario...');
            },
            onUpdated: function () {
                snackOnSucess('Usuario actualizado!');
                $('#userModal').modal('hide');
            },
            onUpdatedError: function (message) {
                snackOnError(message);
            },
            onDelete: function () {
                snackOnPerforming('Eliminando usuario...');
            },
            onDeleted: function () {
                snackOnSucess('Usuario eliminado!');
                $('#userModal').modal('hide');
            },
            onDeletedError: function (message) {
                snackOnError(message);
            }
        },
        tasks: {
            onNew: function () {
                snackOnPerforming('Creando tarea...');
            },
            onNewCreated: function () {
                snackOnSucess('Tarea creada!');
                $('#taskModal').modal('hide');
            },
            onNewCreatedError: function (message) {
                snackOnError(message);
            },
            onUpdate: function () {
                snackOnPerforming('Actualizando tarea...');
            },
            onUpdated: function () {
                snackOnSucess('Tarea actualizada!');
                $('#taskModal').modal('hide');
            },
            onUpdatedError: function (message) {
                snackOnError(message);
            },
            onDelete: function () {
                snackOnPerforming('Eliminando task...');
            },
            onDeleted: function () {
                snackOnSucess('Tarea eliminada!');
                $('#taskModal').modal('hide');
            },
            onDeletedError: function (message) {
                snackOnError(message);
            }
        },
        materials: {
            onNew: function () {
                snackOnPerforming('Agregando material...');
            },
            onNewCreated: function () {
                snackOnSucess('Material agragado!');
                $('#materialModal').modal('hide');
            },
            onNewCreatedError: function (message) {
                snackOnError(message);
            },
            onUpdate: function () {
                snackOnPerforming('Actualizando material...');
            },
            onUpdated: function () {
                snackOnSucess('Material actualizado!');
                $('#materialModal').modal('hide');
            },
            onUpdatedError: function (message) {
                snackOnError(message);
            },
            onDelete: function () {
                snackOnPerforming('Eliminando material...');
            },
            onDeleted: function () {
                snackOnSucess('Material eliminado!');
                $('#materialModal').modal('hide');
            },
            onDeletedError: function (message) {
                snackOnError(message);
            }
        }
    }

    var public = {
        shttp: shttp,
        common: common,
        session: session,
        daemon: daemon,
        sources: sources
    }

    return public;

});
