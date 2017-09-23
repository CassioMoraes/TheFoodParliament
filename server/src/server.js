let express = require('express');
let app = express();
let cors = require('cors');
let GooglePlaces = require('googleplaces');

let apiConfig = require('../apisKeys.js')

let Location = require('./models/location.js');
let VotesService = require('./services/VotesService');
let PlacesService = require('./services/placesService');
let ElectionService = require('./services/ElectionService');
let VotesRepository = require('./infrastructure/votesRepository');
let ElectionController = require('./controllers/electionController');

let MomentWrapper = require('./wrappers/momentWrapper');
let PlacesToRestaurantMapper = require('./services/placesToRestaurantMapper');

const PLACE_TO_LOOK = 'restaurant';
const RADIUS_TO_LOOK = 500;

let votesRepository = new VotesRepository();
let votesService = new VotesService(votesRepository, MomentWrapper);
let googlePlaces = new GooglePlaces(apiConfig.apiKey, apiConfig.outputFormat);
let placesService = new PlacesService(googlePlaces, PLACE_TO_LOOK, RADIUS_TO_LOOK);
let electionService = new ElectionService(placesService, PlacesToRestaurantMapper, votesService, MomentWrapper);
let electionController = new ElectionController(electionService, votesService);

app.use(cors());

app.get('/getElection', function (req, res) {
    let userId = req.query.userId;
    let latitude = req.query.latitude;
    let longitude = req.query.longitude;
    let location = new Location(latitude, longitude);

    electionController.getElection(userId, location, function (election) {
        res.json(election);
    });
})

app.get('/voteForRestaurant', function (req, res) {
    let userId = req.query.userId;
    let restaurantId = req.query.restaurantId;
    let currentDate = new Date();

    electionController.voteForRestaurant(userId, restaurantId, currentDate, function (state) {
        if (state === true) {
            res.status(200);
            res.send('Success');
        } else {
            res.status(500);
            res.send('Vote for restaurant failed!');
        }
    });

});

app.listen(8080);