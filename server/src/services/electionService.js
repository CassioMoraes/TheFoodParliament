let _ = require('lodash');

let Vote = require('../models/Vote');
let Elected = require('../models/Elected');
let Election = require('../models/Election');
let Candidate = require('../models/Candidate');

class ElectionService {
    constructor(placesService, placesMapper, votesService, momentWrapper) {
        this.placesService = placesService;
        this.placesMapper = placesMapper;
        this.votesService = votesService;
        this.momentWrapper = momentWrapper;
    }

    getElection(userId, location, onComplete) {
        var self = this;
        this.placesService.getPlacesForLocation(location, function (places) {
            let restaurants = self.placesMapper.Map(places);

            let candidates = _.map(restaurants, function (restaurant) {
                let restaurantVotes = self.votesService.getDailyVotesForRestaurant(restaurant.id)
                return new Candidate(restaurant, restaurantVotes);
            })

            let userCanVote = self.userCanVote(userId);
            let isElectionOpen = self.isElectionOpen();
            let electedOfToday = self.getElectedOfToday(candidates);
            let electedOfWeek = self.getElectedsOfWeek(candidates);
            let validCandidates = self.removeAlreadyElectedFromCandidates(electedOfWeek, candidates);
            let election = new Election(validCandidates, userCanVote, electedOfToday, electedOfWeek, isElectionOpen);

            onComplete(election);
        });
    }

    userCanVote(userId) {
        let votes = this.votesService.getDailyVotes();

        let userCanVote = !_.some(votes, function (vote) {
            return vote.userId == userId;
        });

        return userCanVote;
    }

    getElectedOfToday(candidates) {
        let elected = null;

        if (this.isElectionOpen())
            return null;

        let allRestaurants = _.map(candidates, 'restaurant');
        let dailyVotes = this.votesService.getDailyVotes();
        let groupedRestaurantsVotes = _.groupBy(dailyVotes, 'restaurantId');

        let orderedByMostVoted = _.orderBy(groupedRestaurantsVotes, function (group) {
            return group.length;
        });
        let mostVoted = _.last(orderedByMostVoted);

        if (mostVoted !== null && mostVoted !== undefined) {
            let restaurant = _.find(allRestaurants, function (restaurant) {
                return restaurant.id == mostVoted[0].restaurantId;
            })

            elected = restaurant;
        }

        return elected;
    }

    getElectedsOfWeek(candidates) {
        let self = this;
        let weeklyVotes = this.votesService.getWeeklyVotes();
        let weeklyVotesWithouHours = _.map(weeklyVotes, function (vote) {
            let date = self.momentWrapper.transformToJustDate(vote.date);
            return new Vote(vote.userId, vote.restaurantId, date)
        })

        let groupedVotes = _.groupBy(weeklyVotesWithouHours, 'date');
        let allRestaurants = _.map(candidates, 'restaurant');

        let electeds = _.map(groupedVotes, function (votes, key) {
            let groupedRestaurants = _.groupBy(votes, 'restaurantId');
            let orderedByMostVoted = _.orderBy(groupedRestaurants, function (group) {
                return group.length;
            })

            let mostVoted = _.last(orderedByMostVoted);

            if (mostVoted !== null && mostVoted !== undefined) {
                let restaurant = _.find(allRestaurants, function (restaurant) {
                    return restaurant.id == mostVoted[0].restaurantId;
                })

                return new Elected(restaurant, new Date(key));
            }
        })

        return electeds;
    }

    removeAlreadyElectedFromCandidates(electedsOfWeek, candidates) {
        let validCandidates = candidates.slice(0);

        _.remove(validCandidates, function (candidate) {
            return _.some(electedsOfWeek, function (electedOfWeek) {
                return candidate.restaurant.id == electedOfWeek.restaurant.id;
            })
        });

        return validCandidates;
    }

    isElectionOpen() {
        let currentDate = this.momentWrapper.getDate();
        let electionOpening = this.momentWrapper.getDateWithSpecificTime(0, 0, 0);
        let electionClosing = this.momentWrapper.getDateWithSpecificTime(8, 20, 0);

        let isSameOrAfter = this.momentWrapper.isSameOrAfter(currentDate, electionOpening);
        let isSameOrBefore = this.momentWrapper.isSameOrBefore(currentDate, electionClosing);

        return isSameOrAfter && isSameOrBefore;
    }
}

module.exports = ElectionService;