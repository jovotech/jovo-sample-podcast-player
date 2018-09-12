'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
    userContext: {
        prev: {
            size: 3
        }
    }
};

const app = new App(config);
const Player = require('./player.js');
const Util = require('./util.js');
const Episodes = require('./episodes.json');
const AlexaHandler = require('./alexa/handler.js');

// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        let speech = this.speechBuilder().addAudio(`${Player.getIntro().uri}`).addT('EXISTING_USER');
        this.ask(speech);
    },
    'NEW_USER': function() {
        let speech = this.speechBuilder().addAudio(`${Player.getIntro().uri}`).addT('NEW_USER');
        this.ask(speech);
    },
});

app.setAlexaHandler(AlexaHandler);

app.setGoogleActionHandler({
    'PlayIntent': function () {
        let song = Player.getLatestEpisode();
        let intro = Player.getIntro();
        let speech = this.speechBuilder()
            .addT('WELCOME')
            .addAudio(intro, "Intro");
        
        this.googleAction().audioPlayer().play(song.uri, 'First song');
        this.googleAction().showSuggestionChips(['lol']);
        this.ask(speech);

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
        this.user().data.episodeList = episodesToSave;
        this.ask(speech);
    },
    'ChooseFromListIntent': function (ordinal) {

    },
    'AUDIOPLAYER': {
        'GoogleAction.Finished': function () {
            this.tell('finished');
        }
    }
})

module.exports.app = app;
