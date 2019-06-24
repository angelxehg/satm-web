
var synth = angular.module('synth');

synth.factory('collate', function () {

    function mapOf(data) {
        var map = [];
        data.forEach(element => {
            var id = element.id;
            map[id] = element;
        });
        return map;
    };

    function spliceFrom(object, fromHere, fromMap = null) {
        var index = fromHere.indexOf(object);
        if (fromMap != null) {
            var id = object.id;
            fromMap[id] = null;
        }
        fromHere.splice(index, 1);
    };

    var spliceQueue = [];

    function pushToQueue(object, fromHere, fromMap = null) {
        var spliceObject = {
            object: object,
            fromHere: fromHere,
            fromMap: fromMap
        }
        spliceQueue.push(spliceObject);
    }

    function performQueue() {
        spliceQueue.forEach(element => {
            spliceFrom(element.object, element.fromHere, element.fromMap);
        });
        spliceQueue = [];
    }

    function collateData(currentSource, responseData) {
        // Get all data
        var responseMap = mapOf(responseData);
        //  For each element in scope
        currentSource.data.forEach(scopeElement => {
            var id = scopeElement.id;
            if (responseMap[id] != null) {
                // It exist in responseData
                var responseElement = responseMap[id];
                if (scopeElement.updated_at != responseElement.updated_at) {
                    // And has changes, so replace it
                    scopeElement.update(responseElement);
                }
                // Discard data-element (so it's not added again)
                spliceFrom(responseElement, responseData);
            } else {
                // It doesnt exist in responseData, so it should be deleted
                // Its added to a queue so we don't destroy currentSource.data during the forEach
                pushToQueue(scopeElement, currentSource.data, currentSource.map)
            }
        });
        // Splice using queue
        performQueue();
        // Restant new elements will be added
        responseData.forEach(element => {
            var complexObject = new currentSource.BasicClass(element, currentSource.complexLinks);
            var id = complexObject.id;
            currentSource.data.push(complexObject);
            currentSource.map[id] = complexObject;
        });
    }

    var public = {
        collateData: collateData
    }

    // Set visible
    return public;

});
