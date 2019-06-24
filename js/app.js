
var ngapp = angular.module('satm', ['ngRoute', 'synth']);

var cli = {}; // Developer purposes

ngapp.config(function config($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'pages/start.html'
        }).
        when('/machines', {
            templateUrl: 'pages/machines.html',
        }).
        when('/tasks', {
            templateUrl: 'pages/tasks.html'
        }).
        when('/materials', {
            templateUrl: 'pages/materials.html'
        }).
        when('/users', {
            templateUrl: 'pages/users.html'
        }).
        otherwise('/');
});

ngapp.controller('mainCtrl', function ($scope, $location, $filter, shttp, trade, daemon, trigger) {

    $scope.status = daemon.status;

    shttp.setURL("../satm-api/public/index.php/api");

    trade.newSource('machines', Machine, [], trigger.sources.machines);
    trade.newSource('components', Component, ['machines'], trigger.sources.components);
    trade.newSource('users', User, [], trigger.sources.users);
    trade.newSource('tasks', Task, ['components', 'users'], trigger.sources.tasks);
    trade.newSource('materials', Material, [], trigger.sources.materials);

    daemon.load();

    $scope.session = {
        login: daemon.login,
        logout: daemon.logout,
        // register: trade.action.register
    }

    $scope.submit = function (data) {
        daemon.login(data);
    }

    $scope.pages = [
        { key: 'machines', title: "Equipos" },
        { key: 'tasks', title: "Tareas" },
        { key: 'materials', title: "Materiales" },
        { key: 'users', title: "Personal" }
    ];

    $scope.ui = {
        isCurrentPage: function (key) {
            var current = $location.path();
            var yours = "/" + key;
            return current == yours ? 'active' : '';
        },
        getPillColor: function (user) {
            if (user.id == 1) {
                return "success";
            } else {
                if (user.isAdmin) {
                    return "danger";
                } else {
                    return "info"
                }
            }
        },
        getPillText: function (user) {
            if (user.id == 1) {
                return "ROOT";
            } else {
                if (user.isAdmin) {
                    return "ADMIN";
                } else {
                    return "PERSONAL"
                }
            }
        }
    }

    $scope.machines = trade.linkSource('machines');
    $scope.components = trade.linkSource('components');
    $scope.users = trade.linkSource('users');
    $scope.tasks = trade.linkSource('tasks');
    $scope.materials = trade.linkSource('materials');

    $scope.machines.ctrl = {
        data: {},
        dataORIGINAL: {},
        createMode: true,
        search: "",
        create: function () {
            var here = $scope.machines;
            here.ctrl.data = {};
            $scope.status.mistakes = {};
            here.ctrl.createMode = true;
            $('#machineModal').modal('show');
        },
        update: function (machine) {
            var here = $scope.machines;
            here.ctrl.data = {};
            $scope.status.mistakes = {};
            here.ctrl.createMode = false;
            here.ctrl.data.id = machine.id;
            here.ctrl.data.brand = machine.brand;
            here.ctrl.data.model = machine.model;
            here.ctrl.data.description = machine.description;
            here.ctrl.data.ubication = machine.ubication;
            here.ctrl.dataORIGINAL = machine;
            $('#machineModal').modal('show');
        },
        delete: function () {
            var here = $scope.machines;
            var original = here.ctrl.dataORIGINAL;
            here.delete(original);
        },
        submit: function () {
            var here = $scope.machines;
            if (here.ctrl.createMode) {
                here.create(here.ctrl.data);
            } else {
                var newObj = here.ctrl.data;
                var original = here.ctrl.dataORIGINAL;
                var newData = {};
                if (original.brand != newObj.brand) {
                    newData.brand = newObj.brand;
                }
                if (original.model != newObj.model) {
                    newData.model = newObj.model;
                }
                if (original.description != newObj.description) {
                    newData.description = newObj.description;
                }
                if (original.ubication != newObj.ubication) {
                    newData.ubication = newObj.ubication;
                }
                newData.id = newObj.id;
                here.update(newData);
            }
        }
    }

    $scope.components.ctrl = {
        data: {},
        dataORIGINAL: {},
        createMode: true,
        search: "",
        create: function (onThisMachine) {
            var here = $scope.components;
            here.ctrl.data = {};
            $scope.status.mistakes = {};
            here.ctrl.data.machine_id = onThisMachine.id;
            here.ctrl.createMode = true;
            $('#componentModal').modal('show');
        },
        update: function (component) {
            var here = $scope.components;
            if (component.isRoot) {
                trigger.sources.components.onUpdatedError("No se debe modificar el componente root!");
            } else {
                here.ctrl.data = {};
                $scope.status.mistakes = {};
                here.ctrl.createMode = false;
                here.ctrl.data.id = component.id;
                here.ctrl.data.brand = component.brand;
                here.ctrl.data.model = component.model;
                here.ctrl.data.description = component.description;
                here.ctrl.data.machine_id = component.machine_id;
                here.ctrl.dataORIGINAL = component;
                $('#componentModal').modal('show');
            }
        },
        delete: function () {
            var here = $scope.components;
            var original = here.ctrl.dataORIGINAL;
            here.delete(original);
        },
        submit: function () {
            var here = $scope.components;
            if (here.ctrl.createMode) {
                here.create(here.ctrl.data);
            } else {
                var newObj = here.ctrl.data;
                var original = here.ctrl.dataORIGINAL;
                var newData = {};
                if (original.brand != newObj.brand) {
                    newData.brand = newObj.brand;
                }
                if (original.model != newObj.model) {
                    newData.model = newObj.model;
                }
                if (original.description != newObj.description) {
                    newData.description = newObj.description;
                }
                if (original.machine_id != newObj.machine_id) {
                    newData.machine_id = newObj.machine_id;
                }
                newData.id = newObj.id;
                here.update(newData);
            }
        }
    }

    $scope.users.ctrl = {
        data: {},
        dataORIGINAL: {},
        createMode: true,
        search: "",
        create: function () {
            var here = $scope.users;
            here.ctrl.data = {};
            $scope.status.mistakes = {};
            here.ctrl.createMode = true;
            $('#userModal').modal('show');
        },
        delete: function () {
            var here = $scope.users;
            var original = here.ctrl.dataORIGINAL;
            here.delete(original);
        },
        update: function (user) {
            var here = $scope.users;
            here.ctrl.data = {};
            $scope.status.mistakes = {};
            here.ctrl.createMode = false;
            here.ctrl.data.id = user.id;
            here.ctrl.data.name = user.name;
            here.ctrl.data.email = user.email;
            here.ctrl.data.hability = user.hability;
            here.ctrl.data.isAdmin = user.isAdmin;
            if ($scope.status.current.id == user.id) {
                here.ctrl.dataORIGINAL = here.map[user.id];
            } else {
                here.ctrl.dataORIGINALL = user;
            }
            here.ctrl.dataORIGINAL = user;
            $('#userModal').modal('show');
        },
        submit: function () {
            var here = $scope.users;
            if (here.ctrl.createMode) {
                here.create(here.ctrl.data);
            } else {
                var newObj = here.ctrl.data;
                var original = here.ctrl.dataORIGINAL;
                var newData = {};
                if (original.name != newObj.name) {
                    newData.name = newObj.name;
                }
                if (original.email != newObj.email) {
                    newData.email = newObj.email;
                }
                if (original.hability != newObj.hability) {
                    newData.hability = newObj.hability;
                }
                if (original.isAdmin != newObj.isAdmin && $scope.status.current.id == 1) {
                    newData.isAdmin = newObj.isAdmin;
                }
                if (newObj.password) {
                    newData.password = newObj.password;
                    newData.password_confirmation = newObj.password_confirmation;
                }
                newData.id = newObj.id;
                here.update(newData);
            }
        }
    }

    $scope.tasks.ctrl = {
        data: {},
        dataORIGINAL: {},
        createMode: true,
        search: "",
        create: function () {
            var here = $scope.tasks;
            here.ctrl.data = {};
            $scope.status.mistakes = {};
            here.ctrl.createMode = true;
            $('#taskModal').modal('show');
        },
        update: function (task) {
            var here = $scope.tasks;
            here.ctrl.data = {};
            $scope.status.mistakes = {};
            here.ctrl.createMode = false;
            here.ctrl.data.id = task.id;
            here.ctrl.data.title = task.title;
            here.ctrl.data.description = task.description;
            here.ctrl.data.priority = task.priority;
            here.ctrl.data.dueDate = task.dueDate;
            here.ctrl.data.component = task.component;
            here.ctrl.data.user = task.user;
            here.ctrl.dataORIGINAL = task;
            $('#taskModal').modal('show');
        },
        delete: function () {
            var here = $scope.tasks;
            var original = here.ctrl.dataORIGINAL;
            here.delete(original);
        },
        submit: function () {
            var here = $scope.tasks;
            if (here.ctrl.createMode) {
                var data = here.ctrl.data;
                if (data.component) {
                    data.component_id = data.component.id;
                }
                if (data.user) {
                    data.user_id = data.user.id;
                }
                if (data.dueDate) {
                    data.dueDate = $filter('date')(data.dueDate, "yyyy-MM-dd") ;
                }
                here.create(data);
            } else {
                var newObj = here.ctrl.data;
                var original = here.ctrl.dataORIGINAL;
                var newData = {};
                if (original.title != newObj.title) {
                    newData.title = newObj.title;
                }
                if (original.description != newObj.description) {
                    newData.description = newObj.description;
                }
                if (original.priority != newObj.priority) {
                    newData.priority = newObj.priority;
                }
                if (original.dueDate != newObj.dueDate) {
                    newData.dueDate = $filter('date')(newObj.dueDate, "yyyy-MM-dd") ;
                }
                if (original.component != newObj.component) {
                    newData.component_id = newObj.component.id;
                }
                if (original.user != newObj.user) {
                    newData.user_id = newObj.user.id;
                }
                newData.id = newObj.id;
                here.update(newData);
            }
        }
    }

    $scope.materials.ctrl = {
        data: {},
        dataORIGINAL: {},
        createMode: true,
        search: "",
        create: function () {
            var here = $scope.materials;
            here.ctrl.data = {};
            $scope.status.mistakes = {};
            here.ctrl.createMode = true;
            $('#materialModal').modal('show');
        },
        update: function (material) {
            var here = $scope.materials;
            here.ctrl.data = {};
            $scope.status.mistakes = {};
            here.ctrl.createMode = false;
            here.ctrl.data.id = material.id;
            here.ctrl.data.brand = material.brand;
            here.ctrl.data.model = material.model;
            here.ctrl.data.description = material.description;
            here.ctrl.data.quantity = material.quantity;
            here.ctrl.dataORIGINAL = material;
            $('#materialModal').modal('show');
        },
        delete: function () {
            var here = $scope.materials;
            var original = here.ctrl.dataORIGINAL;
            here.delete(original);
        },
        submit: function () {
            var here = $scope.materials;
            if (here.ctrl.createMode) {
                here.create(here.ctrl.data);
            } else {
                var newObj = here.ctrl.data;
                var original = here.ctrl.dataORIGINAL;
                var newData = {};
                if (original.brand != newObj.brand) {
                    newData.brand = newObj.brand;
                }
                if (original.model != newObj.model) {
                    newData.model = newObj.model;
                }
                if (original.description != newObj.description) {
                    newData.description = newObj.description;
                }
                if (original.quantity != newObj.quantity) {
                    newData.quantity = newObj.quantity;
                }
                newData.id = newObj.id;
                here.update(newData);
            }
        }
    }

});
