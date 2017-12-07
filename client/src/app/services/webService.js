app.service('webService', ['$http', function ($http) {
    this.getElection = function (userName, latitude, longitude) {
        return $http.get('http://localhost:8080/getElection',
            {
                params: {
                    'userId': userName,
                    'latitude': latitude,
                    'longitude': longitude
                }
            })
    }

    this.voteForRestaurant = function (userName, restaurantId) {
        return $http.get('http://localhost:8080/voteForRestaurant',
            {
                params: {
                    'userId': userName,
                    'restaurantId': restaurantId
                }
            });
    }
}]);