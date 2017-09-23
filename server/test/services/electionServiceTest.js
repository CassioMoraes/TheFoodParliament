let assert = require('assert');
let sinon = require('sinon');
let moment = require('moment');
let fs = require('fs');

let Vote = require('../../src/models/vote');
let Elected = require('../../src/models/Elected');
let Location = require('../../src/models/location');
let Candidate = require('../../src/models/Candidate');
let Restaurant = require('../../src/models/restaurant');

let VotesService = require('../../src/services/votesService');
let ElectionService = require('../../src/services/electionService');
let PlacesService = require('../../src/services/placesService');
let VotesRepository = require('../../src/infrastructure/votesRepository');

let MomentWrapper = require('../../src/wrappers/momentWrapper');
let PlacesToRestaurantMapper = require('../../src/services/placesToRestaurantMapper');

let placesContent = fs.readFileSync(__dirname + '/../testFiles/places.json', "utf8");
let places = JSON.parse(placesContent);

describe('#getElection()', function () {
    it('should return election with 20 candidates and user allowed to vote', function (done) {
        let userId = 1;
        let location = new Location(0, 0);
        let placesService = new PlacesService(null, null, null);

        let votesRepository = new VotesRepository();
        let votesRepositoryStub = sinon.stub(votesRepository, 'load');
        votesRepositoryStub.returns('');

        let votesService = new VotesService(votesRepository, MomentWrapper);

        var placesServiceStub = sinon.stub(placesService, 'getPlacesForLocation');
        placesServiceStub.yields(places.results);

        let electionService = new ElectionService(placesService, PlacesToRestaurantMapper, votesService, MomentWrapper);
        electionService.getElection(userId, location, function (election) {
            assert.equal(election.candidates.length, 20);
            assert.equal(election.userCanVote, true);

            done();
        });
    });

    it('should return election with one elected of week', function (done) {
        let userId = 1;
        let location = new Location(0, 0);
        let placesService = new PlacesService(null, null, null);

        let weekStart = new Date(moment().startOf('week'));
        let vote = new Vote(userId, 'b822c9e09ed350d5f1014b61e09f03288c453341', weekStart);

        let votesRepository = new VotesRepository();
        let votesRepositoryStub = sinon.stub(votesRepository, 'load');
        votesRepositoryStub.returns('');

        let votesService = new VotesService(votesRepository, MomentWrapper);
        let votesServiceStub = sinon.stub(votesService, 'getWeeklyVotes');
        votesServiceStub.returns([vote]);

        var placesServiceStub = sinon.stub(placesService, 'getPlacesForLocation');
        placesServiceStub.yields(places.results);

        let electionService = new ElectionService(placesService, PlacesToRestaurantMapper, votesService, MomentWrapper);
        electionService.getElection(userId, location, function (election) {
            assert.equal(election.electedsOfWeek.length, 1);
            done();
        });
    });

    it('should return election with only candidates that are not on the elected of week collection', function (done) {
        let userId = 1;
        let location = new Location(0, 0);
        let placesService = new PlacesService(null, null, null);

        let firstDayOfWeek = new Date(moment().startOf('week'));
        let secondDayOfWeek = new Date(moment().startOf('week').add(1, 'days'));

        let vote1 = new Vote(userId, 'b822c9e09ed350d5f1014b61e09f03288c453341', firstDayOfWeek);
        let vote2 = new Vote(userId, '4d6ea763e473fc068ccbd800d7f78e1f1c5ca97f', secondDayOfWeek);
        let votes = [vote1, vote2];

        let votesRepository = new VotesRepository();
        let votesRepositoryStub = sinon.stub(votesRepository, 'load');
        votesRepositoryStub.returns('');

        let votesService = new VotesService(votesRepository, MomentWrapper);
        let votesServiceStub = sinon.stub(votesService, 'getWeeklyVotes');
        votesServiceStub.returns(votes);

        var placesServiceStub = sinon.stub(placesService, 'getPlacesForLocation');
        placesServiceStub.yields(places.results);

        let electionService = new ElectionService(placesService, PlacesToRestaurantMapper, votesService, MomentWrapper);
        electionService.getElection(userId, location, function (election) {
            assert.equal(election.candidates.length, 18);
            assert.equal(election.electedsOfWeek.length, 2);
            done();
        });
    });
});

describe('#userCanVote()', function () {
    it('should return true', function () {
        let userId = 1;
        let currentDate = new Date();

        var dailyVotes = [];
        dailyVotes.push(new Vote(2, 1, currentDate));
        dailyVotes.push(new Vote(5, 1, currentDate));

        let votesService = new VotesService();

        let votesServiceStub = sinon.stub(votesService, 'getDailyVotes');
        votesServiceStub.returns(dailyVotes);

        let electionService = new ElectionService(null, null, votesService, MomentWrapper);
        let userCanVote = electionService.userCanVote(userId);

        assert.equal(userCanVote, true);
    })

    it('should return false', function () {
        let userId = 1;
        let currentDate = new Date();

        var dailyVotes = [];
        dailyVotes.push(new Vote(1, 1, currentDate));
        dailyVotes.push(new Vote(2, 1, currentDate));
        dailyVotes.push(new Vote(5, 1, currentDate));

        let votesService = new VotesService();

        let votesServiceStub = sinon.stub(votesService, 'getDailyVotes');
        votesServiceStub.returns(dailyVotes);

        let electionService = new ElectionService(null, null, votesService, MomentWrapper);
        let userCanVote = electionService.userCanVote(userId);

        assert.equal(userCanVote, false);
    })
})

describe('#getElectedsOfToday()', function () {
    it('should return elected of Today', function () {
        let currentDate = new Date();

        let restaurant1 = new Restaurant(1, 'A', '');
        let restaurant2 = new Restaurant(2, 'B', '');

        let vote1 = new Vote(1, 1, currentDate);
        let vote2 = new Vote(2, 2, currentDate);
        let vote3 = new Vote(3, 2, currentDate);
        let dailyVotes = [vote1, vote2, vote3];

        let restaurant1Votes = [vote1];
        let restaurant2Votes = [vote2, vote3];
        let candidate1 = new Candidate(restaurant1, restaurant1Votes);
        let candidate2 = new Candidate(restaurant2, restaurant2Votes);

        let candidates = [candidate1, candidate2];

        let votesService = new VotesService();
        let votesServiceStub = sinon.stub(votesService, 'getDailyVotes');
        votesServiceStub.returns(dailyVotes);

        let electionService = new ElectionService(null, null, votesService, MomentWrapper);
        let electionServiceStub = sinon.stub(electionService, 'isElectionOpen');
        electionServiceStub.returns(false);

        let elected = electionService.getElectedOfToday(candidates);

        assert.equal(elected.id, 2);
    })

    it('no votes should return null', function () {
        let votesService = new VotesService();
        let votesServiceStub = sinon.stub(votesService, 'getDailyVotes');
        votesServiceStub.returns([]);

        let electionService = new ElectionService(null, null, votesService, MomentWrapper);
        let elected = electionService.getElectedOfToday([]);

        assert.equal(elected, null);
    })
})

describe('#getElectedsOfWeek()', function () {
    it('should return 1 candidates', function () {
        let currentDate = new Date();

        let restaurant1 = new Restaurant(1, 'A', '');
        let restaurant2 = new Restaurant(2, 'B', '');
        let restaurant3 = new Restaurant(3, 'C', '');
        let vote1 = new Vote(1, 1, currentDate);
        let vote2 = new Vote(1, 3, currentDate);
        let vote3 = new Vote(1, 3, currentDate);
        let weeklyVotes = [vote1, vote2, vote3];

        let restaurant1Votes = [vote1];
        let restaurant3Votes = [vote2, vote3];
        let candidate1 = new Candidate(restaurant1, restaurant1Votes);
        let candidate3 = new Candidate(restaurant3, restaurant3Votes);

        let candidates = [candidate1, candidate3];

        let votesService = new VotesService();
        let votesServiceStub = sinon.stub(votesService, 'getWeeklyVotes');
        votesServiceStub.returns(weeklyVotes);

        let electionService = new ElectionService(null, null, votesService, MomentWrapper);
        let electedRestaurants = electionService.getElectedsOfWeek(candidates);

        assert.equal(electedRestaurants.length, 1);
        assert.equal(electedRestaurants[0].restaurant.id, 3);
    })

    it('should return 2 candidates', function () {
        let currentDate = new Date();
        let weekStart = new Date(moment().startOf('week'));

        let restaurant1 = new Restaurant(1, 'A', '');
        let restaurant2 = new Restaurant(2, 'B', '');
        let restaurant3 = new Restaurant(3, 'C', '');
        let vote1 = new Vote(1, 2, weekStart);
        let vote2 = new Vote(1, 2, weekStart);
        let vote3 = new Vote(1, 3, weekStart);
        let vote4 = new Vote(1, 1, currentDate);
        let vote5 = new Vote(1, 3, currentDate);
        let vote6 = new Vote(1, 3, currentDate);
        let weeklyVotes = [vote1, vote2, vote3, vote4, vote5, vote6];

        let restaurant1Votes = [vote4];
        let restaurant2Votes = [vote1, vote2];
        let restaurant3Votes = [vote3, vote5, vote6];
        let candidate1 = new Candidate(restaurant1, restaurant1Votes);
        let candidate2 = new Candidate(restaurant2, restaurant2Votes);
        let candidate3 = new Candidate(restaurant3, restaurant3Votes);

        let candidates = [candidate1, candidate2, candidate3];

        let votesService = new VotesService();
        let votesServiceStub = sinon.stub(votesService, 'getWeeklyVotes');
        votesServiceStub.returns(weeklyVotes);

        let electionService = new ElectionService(null, null, votesService, MomentWrapper);
        let electedRestaurants = electionService.getElectedsOfWeek(candidates);

        assert.equal(electedRestaurants.length, 2);
        assert.equal(electedRestaurants[0].restaurant.id, 2);
        assert.equal(electedRestaurants[1].restaurant.id, 3);
    })

    it('on draw should return first on list', function () {
        let currentDate = new Date();
        let weekStart = new Date(moment().startOf('week'));

        let restaurant1 = new Restaurant(1, 'A', '');
        let restaurant2 = new Restaurant(2, 'B', '');        
        let vote1 = new Vote(1, 1, weekStart);
        let vote2 = new Vote(2, 2, weekStart);
        let weeklyVotes = [vote1, vote2];

        let restaurant1Votes = [vote1];
        let restaurant2Votes = [vote2];
        let candidate1 = new Candidate(restaurant1, restaurant1Votes);
        let candidate2 = new Candidate(restaurant2, restaurant2Votes);
        let candidates = [candidate1, candidate2];

        let votesService = new VotesService();
        let votesServiceStub = sinon.stub(votesService, 'getWeeklyVotes');
        votesServiceStub.returns(weeklyVotes);

        let electionService = new ElectionService(null, null, votesService, MomentWrapper);
        let electedRestaurants = electionService.getElectedsOfWeek(candidates);

        assert.equal(electedRestaurants.length, 1);
        assert.equal(electedRestaurants[0].restaurant.id, 2);
    })
})

describe('#removeAlreadyElectedFromCandidates()', function () {
    it('should return only restaurants that are not on elected week list', function () {
        let restaurant1 = new Restaurant(1, 'A', '');
        let restaurant2 = new Restaurant(2, 'B', '');
        let restaurant3 = new Restaurant(3, 'C', '');

        let elected = new Elected(restaurant1, null);

        let electedsOfWeek = [elected];

        let candidate1 = new Candidate(restaurant1, null);
        let candidate2 = new Candidate(restaurant2, null);
        let candidate3 = new Candidate(restaurant3, null);

        let candidates = [candidate1, candidate2, candidate3];

        let electionService = new ElectionService(null, null, null, null);
        let validCandidates = electionService.removeAlreadyElectedFromCandidates(electedsOfWeek, candidates);

        assert.equal(validCandidates.length, 2);
    })
})

describe('#isElectionOpen()', function () {
    it('should return true', function () {
        let date = moment({ hour: 10, minute: 0, second: 0 });

        let momentWrapperStub = sinon.stub(MomentWrapper, 'getDate');
        momentWrapperStub.returns(date);

        let electionService = new ElectionService(null, null, null, MomentWrapper);
        let isElectionOpen = electionService.isElectionOpen();

        momentWrapperStub.restore();

        assert.equal(isElectionOpen, true);
    })

    it('should return false', function () {
        let date = moment({ hour: 15, minute: 0, second: 0 });

        let momentWrapperStub = sinon.stub(MomentWrapper, 'getDate');
        momentWrapperStub.returns(date);

        let electionService = new ElectionService(null, null, null, MomentWrapper);
        let isElectionOpen = electionService.isElectionOpen();

        momentWrapperStub.restore();

        assert.equal(isElectionOpen, false);
    })
})