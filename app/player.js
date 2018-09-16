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
    getNextEpisode: function(episode) {
        let index = findCurrentEpisodeInArray(episode);
        if (index === 0) return undefined;
        return episodesJSON[index - 1];
    },
    getPreviousEpisode: function(episode) {
        let index = findCurrentEpisodeInArray(episode);
        // At episodesJSON.length - 1 is the intro so episodesJSON.length - 2 is the last playable episode
        if (index === episodesJSON.length - 2) return undefined;
        return episodesJSON[index + 1];
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
    },
    /**
     * @param {Object} episode object containing uri and title
     * @returns
     */
    googlePlay: function(episode) {
        this.user().data.currentEpisode = episode;
        this.googleAction().audioPlayer().play(episode.uri, episode.title);
        this.googleAction().showSuggestionChips(['stop', 'start over']);
        this.ask('Enjoy');
    }
}
function findCurrentEpisodeInArray(episode) {
    episode = JSON.stringify(episode);
    let index = 0;
    for (let i = 0; i < episodesJSON.length; i++) {
        if (JSON.stringify(episodesJSON[i]) === episode) {
            index = i;
        }
    }
    return index;
}