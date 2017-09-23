let _ = require('lodash');
let fs = require('fs');
let assert = require('assert');
let PlacesToRestaurantMapper = require('../../src/services/placesToRestaurantMapper')

describe('#Map()', function () {
    it('should return valid object', function () {
        var placesContent = fs.readFileSync(__dirname + '/../testFiles/places.json', "utf8");
        var places = JSON.parse(placesContent);
        var restaurants = PlacesToRestaurantMapper.Map(places.results);

        assert.notEqual(null, restaurants);
        assert.notEqual(undefined, restaurants);
    });

    it('should return not empty object', function () {
        var placesContent = fs.readFileSync(__dirname + '/../testFiles/places.json', "utf8");
        var places = JSON.parse(placesContent);
        var restaurants = PlacesToRestaurantMapper.Map(places.results);

        assert.equal(true, restaurants.length > 0);
    });

    it('should return restaurants with all properties set', function () {
        var placesContent = fs.readFileSync(__dirname + '/../testFiles/places.json', "utf8");
        var places = JSON.parse(placesContent);
        var restaurants = PlacesToRestaurantMapper.Map(places.results);

        _.map(restaurants, function (restaurant) {
            assert.notEqual(undefined, restaurant.id);
            assert.notEqual(undefined, restaurant.name);
            assert.notEqual(undefined, restaurant.address);
        });
    });
});