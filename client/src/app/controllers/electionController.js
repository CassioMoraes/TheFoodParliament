app.controller('ElectionController', ['$scope', 'webService', function ($scope, webService) {
    $scope.election = [];
    $scope.user = { 'name': null };
    $scope.showElection = false;

    $scope.initialize = function () { }

    $scope.nameInput = function () {
        if ($scope.user.name != null && $scope.user.name != undefined) {
            $scope.showElection = true;
            $scope.getElection();
        }
        else
            $scope.showElection = false;
    }

    $scope.getElection = function () {
        webService.getElection($scope.user.name, -29.1689, -51.1785).then(function (response) {
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