angular.module('starter.services', [])
//added "MyWardMyHandbook" to the key to make it unique

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage["MyWardMyHandbook"+key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage["MyWardMyHandbook"+key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage["MyWardMyHandbook"+key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage["MyWardMyHandbook"+key] || '{}');
    }
  }
}]);
