class Election {
    constructor(candidates, userCanVote, electedOfToday, electedsOfWeek, isElectionOpen){
        this.candidates = candidates;
        this.userCanVote = userCanVote;
        this.electedOfToday = electedOfToday;
        this.electedsOfWeek = electedsOfWeek;
        this.isElectionOpen = isElectionOpen;
    }
}

module.exports = Election;