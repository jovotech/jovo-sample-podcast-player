const episodesJSON = require('./episodes.json');

module.exports = {
    getLatestEpisode: function() {
        return episodesJSON[0];
    },
    getFirstEpisode: function() {
        return episodesJSON[episodesJSON.length - 2];
    },
    getIntro: function() {
        return episodesJSON[episodesJSON.length - 1];
    },
    getPossibleEpisodes: function () {
        let episodes = {};
        for (let i = 0; i < 5; i++) {
            
        }
    },
    getNextEpisode: function() {

    },
    /**
     * Plays audiotrack and saves episode to DB as "currentEpisode"
     * @param {Number} offset
     * @param {Object} episode object containing uri and title
     * @param {String} token
     * @returns {Jovo}
     */
    alexaPlay: function(offset, episode, token) {
        this.user().data.currentEpisode = episode;
        this.alexaSkill().audioPlayer()
            .setOffsetInMilliseconds(offset)
            .play(episode.uri, token);
        return this;
    }
}