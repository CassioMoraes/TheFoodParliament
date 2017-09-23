var app = angular.module('TheFoodParliament', []);

app.controller('ElectionController', ['$scope', '$http', function ($scope, $http) {

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
        console.log($scope.name);

        $http.get('http://localhost:8080/getElection',
            {
                params: {
                    'userId': $scope.user.name,
                    'latitude': -29.1689,
                    'longitude': -51.1785
                }
            }).then(function (response) {
                console.log(response);
                $scope.election = response.data;
            }, function errorCallback(response) {
                alert("Error fetching near election!")
            });
    }

    $scope.voteForRestaurant = function (restaurantId) {
        $http.get('http://localhost:8080/voteForRestaurant',
            {
                params: {
                    'userId': $scope.user.name,
                    'restaurantId': restaurantId
                }
            }).then(function (response) {
                console.log(response);
                $scope.getElection();
            }, function errorCallback(response) {
                alert("Error voting for restaurant!")
            });
    }

}]);