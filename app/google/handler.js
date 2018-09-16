const Player = require('../player');
const Util = require('../util');
const Episodes = require('../episodes.json');

module.exports = {
    'FirstEpisodeIntent': function() {
        // User wants to listen to the first episode
        let episode = Player.getFirstEpisode();
        Player.googlePlay.call(this, episode);
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
        Player.googlePlay.call(this, episode);
    },
    'ResumeIntent': function() {
        let episode = this.user().data.currentEpisode;
        Player.googlePlay.call(this, episode);
    },
    'NextIntent': function() {
        let currentEpisode = this.user().data.currentEpisode;
        let episode = Player.getNextEpisode(currentEpisode);
        console.log(episode);
        if (episode) {
            Player.googlePlay.call(this, episode);
        }
        else {
            this.tell(this.t('LAST_EPISODE'));
        }
    },
    'PreviousIntent': function() {
        let currentEpisode = this.user().data.currentEpisode;
        let episode = Player.getPreviousEpisode(currentEpisode);
        if (episode) {
            Player.googlePlay.call(this, episode);
        }
        else {
            this.tell(this.t('FIRST_EPISODE'));
        }
    },
    'END': function() {
        this.tell(this.t('PAUSE'));
    },
    'AUDIOPLAYER': {
        'GoogleAction.Finished': function () {
            let episode = Player.getNextEpisode(this.user().data.currentEpisode);
            if (episode) {
                Player.googlePlay(episode);
            } else {
                this.tell(this.t('LAST_EPISODE'));
            }
        }
    }
}