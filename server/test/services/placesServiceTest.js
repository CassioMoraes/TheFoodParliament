let _ = require('lodash');
let assert = require('assert');
let GooglePlaces = require('googleplaces');
let PlacesService = require('../../src/services/placesService');
let Location = require('../../src/models/location');
let apiKeys = require('../../apisKeys.js');

let defaultLocation = new Location(-29.1689, -51.1785);
let googlePlaces = new GooglePlaces(apiKeys.apiKey, apiKeys.outputFormat);
let placesService = new PlacesService(googlePlaces, 'restaurant', 500);

describe('#getPlacesForLocation()', function () {
    it('should not return undefined object', function (done) {
        placesService.getPlacesForLocation(defaultLocation, function (places) {
            assert.notEqual(undefined, places);
            done();
        });
    });

    it('should not return empty', function (done) {
        placesService.getPlacesForLocation(defaultLocation, function (places) {
            assert.equal(true, places.length > 0);
            done();
        });
    });

    it ('should return only restaurant type', function (done) {
        placesService.getPlacesForLocation(defaultLocation, function (places) {
            _.map(places, function(place) {
                assert.equal(true, _.includes(place.types, 'restaurant'));
            }, this);
            done()
        });
    });
});