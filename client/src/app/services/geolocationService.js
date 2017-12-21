app.service('geolocationService', ['$window', function ($window) {
    this.getLocation = function (callback, error) {
        if ($window.navigator.geolocation) {
            return $window.navigator.geolocation.getCurrentPosition(callback, error);  
        }
    };
}]);