let assert = require('assert');
let sinon = require('sinon');
let fs = require('fs');
let Location = require('../../src/models/location');
let ElectionController = require('../../src/controllers/electionController');
let ElectionService = require('../../src/services/electionService');
let PlacesService = require('../../src/services/placesService');
let VotesService = require('../../src/services/votesService');
let VotesRepository = require('../../src/infrastructure/votesRepository');

let MomentWrapper = require('../../src/wrappers/momentWrapper');
let PlacesToRestaurantMapper = require('../../src/services/placesToRestaurantMapper');

let placesContent = fs.readFileSync(__dirname + '/../testFiles/places.json', "utf8");
let places = JSON.parse(placesContent);

describe('#getElection()', function () {
  it('should return election with 20 candidates', function (done) {
    let userId = 1;
    let location = new Location(0, 0);

    let votesRepository = new VotesRepository();
    let votesRepositoryStub = sinon.stub(votesRepository, 'load');
    votesRepositoryStub.returns('');

    let votesService = new VotesService(votesRepository, MomentWrapper);

    let placesService = new PlacesService(null, null, null);
    let placesServiceStub = sinon.stub(placesService, 'getPlacesForLocation');
    placesServiceStub.yields(places.results);

    let electionService = new ElectionService(placesService, PlacesToRestaurantMapper, votesService, MomentWrapper);

    let electionController = new ElectionController(electionService, votesService);
    electionController.getElection(userId, location, function (election) {
      assert.equal(election.candidates.length, 20);
      done();
    });
  });
});

describe('#voteForRestaurant()', function () {
  it('should cast a vote for the selected restaurant', function () {
    let location = new Location(0, 0);
    let placesService = new PlacesService(null, null, null);

    let votesService = new VotesService(null, MomentWrapper);
    let votesServiceStub = sinon.stub(votesService, 'addVote');
    votesServiceStub.yields(true);

    let currentUserId = 1;
    let currentRestaurantId = "100a";
    let currentDate = new Date();

    let electionController = new ElectionController(null, votesService);
    electionController.voteForRestaurant(currentUserId, currentRestaurantId, currentDate, function (status) {
      assert.equal(status, true);
    });
  });
});