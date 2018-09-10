const Player = require('../player');
const Util = require('../util');
const Episodes = require('../episodes.json');

module.exports = {
    /**
     * TODO
     * add built in intents (https://developer.amazon.com/docs/custom-skills/audioplayer-interface-reference.html#intents) and tell user that
     * they are not implemented in this skill
     */
    'FirstEpisodeIntent': function() {
        // User wants to listen to the first episode
        let episode = Player.getFirstEpisode();
        Player.alexaPlay.call(this, 0, episode, 'token');
    },
    'ListIntent': function() {
        /**
         * User wants to choose from a list
         * Create copy of list and shuffle it using the Fisher Yates shuffle (https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array)
         * save copied & shuffled arr to DB to know which one the user chose in the 'ChooseFromListIntent'
         */
        let speech = this.speechBuilder().addT('LIST_EPISODES');
        let episodes = Episodes.slice(0, Episodes.length - 1);
        episodes = Util.shuffle(episodes);
        let episodesToSave = [];
        for (let i = 0; i < Util.EPISODES_TO_LIST; i++) {
            speech.addSayAsOrdinal(`${i + 1}`).addText(episodes[i].title).addBreak("100ms");
            episodesToSave.push(episodes[i]);
        }
        speech.addT('CHOOSE_EPISODE');
        this.user().data.episodeList = episodesToSave;
        this.ask(speech);
    },
    'ChooseFromListIntent': function (ordinal) {
        let episode = this.user().data.episodeList[ordinal.key - 1]; // First is saved at index 0 and so on
        Player.alexaPlay.call(this, 0, episode, 'token').endSession();
    },
    'AMAZON.ResumeIntent': function () {
        let episode = this.user().data.currentEpisode;
        Player.alexaPlay.call(this, this.user().data.offset, episode, 'token').endSession();
    },
    'AMAZON.NextIntent': function() {
        let currentEpisode = this.user().data.currentEpisode;
        let episode = Player.getNextEpisode(currentEpisode);
        console.log(episode);
        if (episode) {
            Player.alexaPlay.call(this, 0, episode, 'token').endSession();
        }
        else {
            this.tell(this.t('LAST_EPISODE'));
        }
    },
    'AMAZON.PreviousIntent': function() {
        let currentEpisode = this.user().data.currentEpisode;
        let episode = Player.getPreviousEpisode(currentEpisode);
        Player.alexaPlay.call(this, 0, episode, 'token').endSession();
    },
    'AMAZON.StartOverIntent': function() {
        let episode = this.user().data.currentEpisode;
        Player.alexaPlay.call(this, 0, episode, 'token').endSession();
    },
    'AMAZON.PauseIntent': function () {
        this.alexaSkill().audioPlayer().stop();
        this.tell(this.t('PAUSE'));
    },
    'AMAZON.StopIntent': function() {
        this.alexaSkill().audioPlayer().stop();
        this.tell(this.t('PAUSE'));
    },
    'AMAZON.CancelIntent': function() {
        this.alexaSkill().audioPlayer().stop();
        this.tell(this.t('PAUSE'));
    },

    'AUDIOPLAYER': {
        'AudioPlayer.PlaybackStarted': function() {
            this.endSession();
        },
        'AudioPlayer.PlaybackNearlyFinished': function() {
            // Enqueue next episode and save epsiode object to DB
            let episode = Player.getNextEpisode.call(this);
            console.log(episode);
            if (episode) {
                this.user().data.nextEpisode = episode;
                this.alexaSkill().audioPlayer().setExpectedPreviousToken('token').enqueue(episode.uri, 'token');
            }
        },

        'AudioPlayer.PlaybackFinished': function() {
            this.user().data.currentEpisode = this.user().data.nextEpisode;
            delete this.user().data.nextEpisode;
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