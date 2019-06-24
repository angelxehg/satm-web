
var synth = angular.module('synth');

synth.factory('TradeSource', function (shttp, collate, trigger, daemon) {

    class TradeSource {

        constructor(name, BasicClass, complexLinks, triggers) {
            this.data = [];
            this.map = [];
            this.name = name;
            this.subURL = "/" + name;
            this.BasicClass = BasicClass;
            this.complexLinks = complexLinks;
            this.synthKey = "X";
            this.lock = false;
            this.triggers = triggers;
        }

        load(onSucessWaterfall) {
            var currentSource = this;
            currentSource.lock = true; // Prevent multiple requests
            function onSucess(response) {
                if (response.data) {
                    currentSource.data = [];
                    var loaded = response.data.data;
                    currentSource.synthKey = response.data.synthKey;
                    collate.collateData(
                        currentSource,
                        response.data.data
                    );
                }
                currentSource.lock = false;
                onSucessWaterfall();
            };
            function onError(response) {
                currentSource.lock = false;
                onSucessWaterfall();
            }
            shttp.get(this.subURL, null, onSucess, onError);
        }

        clear() {
            this.data.forEach(data => {
                var id = data.id;
                this.map[id] = null;
            });
            var len = this.data.length;
            this.data.splice(0, len);
            this.synthKey = "X";
        }

        trigger() {
            var currentSource = this;
            currentSource.lock = true; // Prevent multiple requests
            function onSucess(response) {
                if (response.data) {
                    currentSource.synthKey = response.data.synthKey;
                    collate.collateData(
                        currentSource,
                        response.data.data
                    );
                }
                currentSource.lock = false;
            }
            function onError(response) {
                currentSource.lock = false;
            }
            shttp.get(currentSource.subURL, null, onSucess, onError);
        }

        create(object) {
            var currentSource = this;
            currentSource.triggers.onNew();
            daemon.status.mistakes = {};
            function onSucess(response) {
                var complexObject = new currentSource.BasicClass(response.data.data, currentSource.complexLinks);
                var id = complexObject.id;
                currentSource.data.push(complexObject);
                currentSource.map[id] = complexObject;
                currentSource.triggers.onNewCreated();
            }
            function onError(response) {
                if (response.data.message) {
                    currentSource.triggers.onNewCreatedError(response.data.message);
                    daemon.status.mistakes = response.data.data;
                } else {
                    trigger.common.onConnecionError();
                }
            }
            shttp.post(currentSource.subURL, object, onSucess, onError);
        }

        update(object) {
            var currentSource = this;
            currentSource.triggers.onUpdate();
            daemon.status.mistakes = {};
            function onSucess(response) {
                var newObject = response.data.data;
                var currentObject = currentSource.map[newObject.id];
                currentObject.update(newObject);
                currentSource.triggers.onUpdated();
            }
            function onError(response) {
                if (response.data.message) {
                    currentSource.triggers.onUpdatedError(response.data.message);
                    daemon.status.mistakes = response.data.data;
                } else {
                    trigger.common.onConnecionError();
                }
            }
            shttp.put(currentSource.subURL + "/" + object.id, object, onSucess, onError);
        }

        delete(object) {
            var currentSource = this;
            var currentObject = currentSource.map[object.id];
            currentSource.triggers.onDelete();
            function onSucess(response) {
                var index = currentSource.data.indexOf(currentObject);
                var id = currentObject.id;
                currentSource.data.splice(index, 1);
                currentSource.map[id] = null;
                currentSource.triggers.onDeleted();
            }
            function onError(response) {
                if (response.data.message) {
                    currentSource.triggers.onDeletedError(response.data.message);
                } else {
                    trigger.common.onConnecionError();
                }
            }
            shttp.delete(currentSource.subURL + "/" + object.id, null, onSucess, onError);
        }

    }

    return TradeSource;

});

// Create trade factory
synth.factory('trade', function (daemon, TradeSource, trigger) {

    var sources = [];
    sources.map = [];
    sources.waterFall = {
        count: 0
    }

    function onDaemon(response) {
        if (response.data.synthKeys) {
            var synthKeys = response.data.synthKeys;
            sources.forEach(source => {
                var k1 = source.synthKey;
                var k2 = synthKeys[source.name];
                if (k1 != k2 && !source.lock) {
                    source.trigger();
                }
            });
        }
    }

    function onSessionDestroyed() {
        sources.forEach(source => {
            source.clear();
        });
        Snackbar.show({
            text: 'Se ha cerrado sesión',
            showAction: true,
            actionText: "OK"
        });
    }

    function onWaterFall() {
        var waterFall = sources.waterFall;
        function onSucessWaterfall() {
            waterFall.count++;
            var status = daemon.status;
            status.progress = waterFall.count * 100 / 6;
            if (waterFall.count == 6) {
                trigger.session.onLoginSucess();
                status.logged = true;
                waterFall.count = 0;
                status.progress = 0;
            }
        }
        onSucessWaterfall(); // first
        sources.forEach(source => {
            source.load(onSucessWaterfall);
        });
    }

    trigger.daemon.onDaemon = onDaemon;
    trigger.daemon.onSessionDestroyed = onSessionDestroyed;
    trigger.daemon.onWaterFall = onWaterFall;

    function newSource(name, BasicClass, links, triggers) {
        var complexLinks = [];
        if (links) {
            links.forEach(link => {
                complexLinks[link] = sources.map[link].map;
            });
        }
        var complexSource = new TradeSource(name, BasicClass, complexLinks, triggers);
        sources.push(complexSource)
        sources.map[name] = complexSource;
    }

    function linkSource(name) {
        return sources.map[name];
    }

    var public = {
        newSource: newSource,
        linkSource, linkSource
    }

    return public;

});
