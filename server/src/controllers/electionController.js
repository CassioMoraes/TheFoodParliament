let _ = require('lodash');
let Restaurant = require('../models/restaurant')
let Vote = require('../models/vote');

class ElectionController {
    constructor(electionService, votesService) {
        this.electionService = electionService;
        this.votesService = votesService;
    }

    getElection(userId, location, onComplete) {
        this.electionService.getElection(userId, location, onComplete);
    }

    voteForRestaurant(userId, restaurantId, date, onComplete) {
        let newVote = new Vote(userId, restaurantId, date);
        this.votesService.addVote(newVote, onComplete);
    }
}

module.exports = ElectionController;