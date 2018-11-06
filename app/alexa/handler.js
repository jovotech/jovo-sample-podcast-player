const Player = require('../player.js');

module.exports = {
    'AMAZON.CancelIntent': function() {
        this.tell('Alright, see you next time!');
    },
    'AMAZON.PauseIntent': function() {
        this.alexaSkill().audioPlayer().stop();
        this.endSession();
    },
    'AMAZON.LoopOffIntent': function() {
        this.tell('Not implemented');
    },
    'AMAZON.LoopOnIntent': function() {
        this.tell('Not implemented');
    },
    'AMAZON.LoopOffIntent': function() {
        this.tell('Not implemented');
    },
    'AMAZON.RepeatIntent': function() {
        this.tell('Not implemented');
    },
    'AMAZON.ShuffleOffIntent': function() {
        this.tell('Not implemented');
    },
    'AMAZON.ShuffleOnIntent': function() {
        this.tell('Not implemented');
    },
    'AMAZON.StartOverIntent': function() {
        this.tell('Not implemented');
    },
    'AUDIOPLAYER': {
        'AudioPlayer.PlaybackStarted': function() {
            this.endSession();
        },
        'AudioPlayer.PlaybackNearlyFinished': function() {
            let index = this.user().data.currentIndex;
            let episode = Player.getNextEpisode(index);
            if (episode) {
                this.alexaSkill().audioPlayer().setExpectedPreviousToken('token').enqueue(episode.url, 'token');
            } else {
                this.endSession();
            }
        },
        'AudioPlayer.PlaybackFinished': function() {
            let currentIndex = this.user().data.currentIndex;
            if (currentIndex > 0) {
                this.user().data.currentIndex = currentIndex - 1;
            }
            this.endSession();
        },
        'AudioPlayer.PlaybackStopped': function() {
            this.user().data.offset = this.alexaSkill().audioPlayer().getOffsetInMilliseconds();
            this.endSession();
        },
        'AudioPlayer.PlaybackFailed': function() {
            this.endSession();
        }
    }
}