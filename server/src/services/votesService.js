let _ = require('lodash');
let Vote = require('../models/vote');

class VotesService {
    constructor(votesRepository, momentWrapper) {
        this.votesRepository = votesRepository;
        this.momentWrapper = momentWrapper;
    }

    getVotes() {
        this.votesRepository.load();
    }

    addVote(vote, onCompleted) {
        var votes = this.votesRepository.load();
        votes.push(vote);

        this.votesRepository.save(votes, onCompleted);
    }

    getDailyVotesForRestaurant(restaurantId) {
        let votes = this.votesRepository.load();
        let currentDate = new Date();
        let restaurantVotes = []
        let self = this;

        _.map(votes, function (vote) {
            let voteDate = self.momentWrapper.getMomentFromDate(vote.date);
            let isSameRestaurant = vote.restaurantId === restaurantId;
            let isSameDay = voteDate.isSame(currentDate, 'day');

            if (isSameRestaurant && isSameDay)
                restaurantVotes.push(vote);
        });

        return restaurantVotes;
    }

    getDailyVotes() {
        let votes = this.votesRepository.load();
        let currentDate = this.momentWrapper.getDate();
        var dailyVotes = [];
        let self = this;

        _.map(votes, function (vote) {
            let voteDate = self.momentWrapper.getMomentFromDate(vote.date);

            if (self.momentWrapper.isSameDay(voteDate, currentDate))
                dailyVotes.push(vote);
        });

        return dailyVotes;
    }

    getWeeklyVotes() {
        let votes = this.votesRepository.load();

        let self = this;
        var weeklyVotes = [];
        let currentDate = this.momentWrapper.getDate();
        let startOfWeek = this.momentWrapper.getStartOfWeek();
        let endOfWeek = this.momentWrapper.getEndOfWeek();

        _.map(votes, function (vote) {
            let voteDate = self.momentWrapper.getMomentFromDate(vote.date);

            if (!self.momentWrapper.isSameDay(voteDate, currentDate)) {
                let isSameOrAfterDay = self.momentWrapper.isSameOrAfterDay(voteDate, startOfWeek);
                let isSameOrBeforeDay = self.momentWrapper.isSameOrBeforeDay(voteDate, endOfWeek);

                if (isSameOrAfterDay && isSameOrBeforeDay)
                    weeklyVotes.push(vote);
            }
        });

        return weeklyVotes;
    }
}

module.exports = VotesService;