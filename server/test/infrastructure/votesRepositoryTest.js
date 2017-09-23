let _ = require('lodash');
let sinon = require('sinon');
let assert = require('assert');

let Vote = require('../../src/models/vote');
let VotesRepository = require('../../src/infrastructure/votesRepository');

let votesTestFile = __dirname + '/../testFiles/votes.json';
let votesRepository = new VotesRepository();
votesRepository.mocksPath = votesTestFile;

describe('#save()', function () {
    it('should return true', function () {
        let userId = 1;
        let restaurantId = 'testVote';
        let date = new Date();
        let vote = new Vote(userId, restaurantId, date);
        let votes = [vote];

        votesRepository.save(votes, function (status) {
            assert.equal(status, true);
        });
    });

    after(function () {
        votesRepository.save([], function (status) { });
    });
});

describe('#load()', function () {
    it('should return votes from file', function () {
        let userId = 1;
        let restaurantId = 'testVote';
        let date = new Date();
        let vote = new Vote(userId, restaurantId, date);
        let votes = [vote];

        votesRepository.save(votes, function (status) {
            let loadesVotes = votesRepository.load();

            assert.equal(loadesVotes.length, 1);
            assert.equal(loadesVotes[0].restaurantId, 'testVote');
        });
    });

    after(function () {
        votesRepository.save([], function (status) { });
    });
});