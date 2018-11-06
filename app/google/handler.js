const Player = require('../player.js');

module.exports = {
    'AUDIOPLAYER': {
        'GoogleAction.Finished': function() {
            let index = this.user().data.currentIndex;
            let episode = Player.getNextEpisode(index);
            if (episode) {
                this.user().data.currentIndex -= 1;
                this.googleAction().audioPlayer().play(episode.url, 'episode one');
                this.googleAction().showSuggestionChips(['pause', 'start over']);
                this.ask('Enjoy');
            } else {
                this.endSession();
            }
        }
    },
}