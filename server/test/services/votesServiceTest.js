let _ = require('lodash');
let sinon = require('sinon');
let assert = require('assert');

let Vote = require('../../src/models/vote');
let VotesService = require('../../src/services/votesService');
let VotesRepository = require('../../src/infrastructure/votesRepository');

let MomentWrapper = require('../../src/wrappers/momentWrapper');

describe('#addVote()', function () {
    it('should add one vote succesfully', function () {
        let emptyArray = [];

        let userId = 1;
        let restaurantId = "100a";
        let date = new Date();
        let vote = new Vote(userId, restaurantId, date);

        let votesRepository = new VotesRepository();
        let votesRepositoryStub = sinon.stub(votesRepository, 'save');
        votesRepositoryStub.returns(true);

        let votesService = new VotesService(votesRepository, MomentWrapper);
        votesService.addVote(vote, function (status) {
            assert.equal(status, true);
        });
    });
});

describe('#getDailyVotesForRestaurant()', function () {
    it('should return two votes for restaurant 100a', function () {
        let userId1 = 1;
        let userId2 = 2;
        let userId3 = 3;
        let restaurantId1 = "100a";
        let restaurantId2 = "200b";
        let date = new Date();
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let vote0 = new Vote(userId1, restaurantId1, yesterday);
        let vote1 = new Vote(userId1, restaurantId1, date);
        let vote2 = new Vote(userId2, restaurantId2, date);
        let vote3 = new Vote(userId3, restaurantId1, date);
        let votes = [vote0, vote1, vote2, vote3];

        let votesRepository = new VotesRepository();
        let votesRepositoryStub = sinon.stub(votesRepository, 'load');
        votesRepositoryStub.returns(votes);
        let votesService = new VotesService(votesRepository, MomentWrapper);

        let restaurant1Votes = votesService.getDailyVotesForRestaurant(restaurantId1);

        assert.equal(restaurant1Votes.length, 2);
    });
});

describe('#getDailyVotes()', function () {
    it('should return three votes for today', function () {
        let userId1 = 1;
        let userId2 = 2;
        let userId3 = 3;
        let restaurantId1 = "100a";
        let restaurantId2 = "200b";
        let date = new Date();
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let vote0 = new Vote(userId1, restaurantId1, yesterday);
        let vote1 = new Vote(userId1, restaurantId1, date);
        let vote2 = new Vote(userId2, restaurantId2, date);
        let vote3 = new Vote(userId3, restaurantId1, date);
        let votes = [vote0, vote1, vote2, vote3];

        let votesRepository = new VotesRepository();
        let votesRepositoryStub = sinon.stub(votesRepository, 'load');
        votesRepositoryStub.returns(votes);
        let votesService = new VotesService(votesRepository, MomentWrapper);

        let dailyVotes = votesService.getDailyVotes();

        assert.equal(dailyVotes.length, 3);
    });
});

describe('#getWeeklyVotes()', function () {
    it('should return only votes for the current week', function () {
        let userId1 = 1;
        let userId2 = 2;
        let userId3 = 3;
        let restaurantId1 = "100a";
        let restaurantId2 = "200b";

        let date = new Date();
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        let vote0 = new Vote(userId1, restaurantId1, lastWeek);
        let vote1 = new Vote(userId1, restaurantId1, yesterday);
        let vote2 = new Vote(userId2, restaurantId2, yesterday);
        let vote3 = new Vote(userId3, restaurantId1, date);
        let votes = [vote0, vote1, vote2, vote3];

        let votesRepository = new VotesRepository();
        let votesRepositoryStub = sinon.stub(votesRepository, 'load');
        votesRepositoryStub.returns(votes);
        let votesService = new VotesService(votesRepository, MomentWrapper);

        let weeklyVotes = votesService.getWeeklyVotes();

        assert.equal(weeklyVotes.length, 2);
    })

    it('should not return any vote', function () {
        let userId1 = 1;
        let restaurantId1 = "100a";

        let lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        let vote0 = new Vote(userId1, restaurantId1, lastWeek);
        let votes = [vote0];

        let votesRepository = new VotesRepository();
        let votesRepositoryStub = sinon.stub(votesRepository, 'load');
        votesRepositoryStub.returns(votes);
        
        let votesService = new VotesService(votesRepository, MomentWrapper);

        let weeklyVotes = votesService.getWeeklyVotes();

        assert.equal(weeklyVotes.length, 0);
    })

    it('should return not return currentDay voted restaurant', function () {
        let userId1 = 1;
        let userId2 = 2;
        let userId3 = 3;
        let restaurantId1 = "100a";
        let restaurantId2 = "200b";
        let restaurantId3 = "300c";

        let date = new Date();
        date.setHours(11, 0, 0, 0);

        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let vote0 = new Vote(userId1, restaurantId1, yesterday);
        let vote1 = new Vote(userId1, restaurantId2, yesterday);
        let vote2 = new Vote(userId2, restaurantId2, yesterday);
        let vote3 = new Vote(userId3, restaurantId3, date);
        let votes = [vote0, vote1, vote2, vote3];

        let votesRepository = new VotesRepository();
        let votesRepositoryStub = sinon.stub(votesRepository, 'load');
        votesRepositoryStub.returns(votes);
        let votesService = new VotesService(votesRepository, MomentWrapper);

        let weeklyVotes = votesService.getWeeklyVotes();

        assert.equal(weeklyVotes.length, 3);
    })
});