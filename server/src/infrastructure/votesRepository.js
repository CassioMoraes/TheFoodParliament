let fs = require('fs');

class VotesRepository {

    constructor() {
        this.mocksPath = __dirname + '/dataMocks/votes.json';
    }

    load() {
        let data = fs.readFileSync(this.mocksPath, "utf8");
        let votes = [];
        let votesSaved = JSON.parse(data);

        if (votesSaved.length > 0)
            votes = votesSaved;

        return votes;
    }

    save(votes, onComplete) {
        let stringifiedVotes = JSON.stringify(votes);

        fs.writeFile(this.mocksPath, stringifiedVotes, 'utf-8', function (err) {
            if (err) {
                console.log(err)
                onComplete(false);
            }

            onComplete(true);
        });
    }
}

module.exports = VotesRepository;