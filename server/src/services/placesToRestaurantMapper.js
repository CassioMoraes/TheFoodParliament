let _ = require('lodash');
let Restaurant = require('../models/restaurant');

class PlacesToRestaurantMapper {
    static Map(places) {
        var restaurants = [];

        _.map(places, function (place){
            restaurants.push(new Restaurant(place.id, place.name, place.vicinity));
        })

        return restaurants;
    }
}

module.exports = PlacesToRestaurantMapper;