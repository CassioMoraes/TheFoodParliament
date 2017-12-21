app.controller('ElectionController', ['$scope', 'webService', 'geolocationService', function ($scope, webService, geolocationService) {
    $scope.election = [];
    $scope.user = { 'name': null };
    $scope.showElection = false;

    $scope.location = null;
    $scope.geolocationStatus = null;

    $scope.initialize = function () {
        console.log("Geolocation", $scope.geolocationStatus);

        geolocationService.getLocation(function (position) {
            $scope.geolocationStatus = { 'enabled': true, 'message': 'Success' };

            $scope.location = {
                'latitude': position.coords.latitude,
                'longitude': position.coords.longitude
            };

            $scope.$apply();
        }, function (error) {
            $scope.geolocationStatus = { 'enabled': false, 'message': error.message };
            $scope.$apply();
        });
    }

    $scope.nameInput = function () {
        if ($scope.user.name != null && $scope.user.name != undefined) {
            $scope.showElection = true;
            $scope.getElection();
        }
        else
            $scope.showElection = false;
    }

    $scope.getElection = function () {
        webService.getElection($scope.user.name, $scope.location.latitude, $scope.location.longitude).then(function (response) {
            console.log(response);
            $scope.election = response.data;
        }, function errorCallback(response) {
            alert("Error fetching near election!")
        });
    }

    $scope.voteForRestaurant = function (restaurantId) {
        webService.voteForRestaurant($scope.user.name, restaurantId).then(function (response) {
            console.log(response);
            $scope.getElection();
        }, function errorCallback(response) {
            alert("Error voting for restaurant!")
        });
    }
}]);