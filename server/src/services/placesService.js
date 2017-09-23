var Location = require('../models/location.js');

class PlacesService {
    constructor(placesApi, placeType, radius) {
        this.placesApi = placesApi;
        this.placeType = placeType;
        this.radius = radius;
    }

    getPlacesForLocation(location, callback) {
        let parameters = {
            location: [location.latitude, location.longitude],
            types: this.placeType,
            radius: this.radius
        };

        this.placesApi.placeSearch(parameters, function (error, response) {
            if (error) throw error;
            callback(response.results);
        });
    }
}

module.exports = PlacesService;