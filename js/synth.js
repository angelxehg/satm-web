
var synth = angular.module('synth', []);

// Load in this order

/*

classes
synth
synth.collate
synth.trigger ($log)
synth.shttp ($http, trigger)
synth.daemon ($rootScope, $window, $interval, trigger, shttp)
synth.trade (shttp, collate, TradeSource, trigger)
app ($scope, $location, shttp, trade, daemon)


*/
