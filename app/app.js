'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

let myIntentMap = {
    'AMAZON.NextIntent': 'NextIntent',
    'AMAZON.PreviousIntent': 'PreviousIntent',
    'AMAZON.ResumeIntent': 'ResumeIntent',
    'AMAZON.HelpIntent': 'HelpIntent',
    'AMAZON.StopIntent': 'CancelIntent' 
};

const config = {
    logging: true,
    intentMap: myIntentMap
};

const app = new App(config);
const Player = require('./player.js');
const AlexaHandler = require('./alexa/handler.js');
const GoogleHandler = require('./google/handler.js');

// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'NEW_USER': function() {
        this.ask('Would you like to begin listening from episode one or rather choose from a list?');
    },
    'LAUNCH': function () {
        this.ask('Would you like to resume where you left off or listen to the latest episode?');
    },
    'FirstEpisodeIntent': function() {
        let episode = Player.getFirstEpisode();
        let currentIndex = Player.getEpisodeIndex(episode);
        this.user().data.currentIndex = currentIndex
        if (this.isAlexaSkill()) {
            this.alexaSkill().audioPlayer().setOffsetInMilliseconds(0).play(episode.url, `${currentIndex}`);
            this.endSession();
        } else if (this.isGoogleAction()) {
            this.googleAction().audioPlayer().play(episode.url, episode.title);
            this.googleAction().showSuggestionChips(['pause', 'start over']);
            this.ask('Enjoy');
        }
    },
    'LatestEpisodeIntent': function() {
        let episode = Player.getLatestEpisode();
        let currentIndex = Player.getEpisodeIndex(episode);
        this.user().data.currentIndex = currentIndex;
        if (this.isAlexaSkill()) {
            this.alexaSkill().audioPlayer().setOffsetInMilliseconds(0).play(episode.url, `${currentIndex}`);
            this.endSession();
        } else if (this.isGoogleAction()) {
            this.googleAction().audioPlayer().play(episode.url, episode.title);
            this.googleAction().showSuggestionChips(['pause', 'start over']);
            this.ask('Enjoy');
        }
    },
    'ListIntent': function() {
        const indices = Player.getRandomIndices(4);
        this.setSessionAttribute('episodeIndices', indices);
    
        let speech = this.speechBuilder().addText('Here\'s a list of episodes: ');
        for (let i = 0; i < indices.length; i++) {
            let episode = Player.getEpisode(indices[i]);
            speech.addSayAsOrdinal(`${i + 1}`).addText(episode.title).addBreak("100ms");
        }
        speech.addText('Which one would you like to listen to?');
        this.ask(speech);
    },
    'ChooseFromListIntent': function(ordinal) {
        let episodeIndices = this.getSessionAttribute('episodeIndices');
        let episodeIndex = episodeIndices[parseInt(ordinal.key) - 1];
        this.user().data.currentIndex = episodeIndex;
        let episode = Player.getEpisode(episodeIndex);
    
        if (this.isAlexaSkill()) {
            this.alexaSkill().audioPlayer().setOffsetInMilliseconds(0).play(episode.url, `${episodeIndex}`);
            this.endSession();
        } else if (this.isGoogleAction()) {
            this.googleAction().audioPlayer().play(episode.url, episode.title);
            this.googleAction().showSuggestionChips(['pause', 'start over']);
            this.ask('Enjoy');
        }
    },

    'ResumeIntent': function () {
        let currentIndex = this.user().data.currentIndex;
        let episode = Player.getEpisode(currentIndex);
    
        if (this.isAlexaSkill()) {
            let offset = this.user().data.offset;
            this.alexaSkill().audioPlayer().setOffsetInMilliseconds(offset).play(episode.url, `${currentIndex}`);
            this.endSession();
        } else if (this.isGoogleAction()) {
            this.googleAction().audioPlayer().play(episode.url, episode.title);
            this.googleAction().showSuggestionChips(['pause', 'start over']);
            this.ask('Enjoy');
        }
    },
    'NextIntent': function() {
        let currentIndex = this.user().data.currentIndex;
        let nextEpisode = Player.getNextEpisode(currentIndex);
        if (!nextEpisode) {
            this.tell('That was the most recent episode. You have to wait until a new episode gets released.');
            return;
        }
        currentIndex = Player.getEpisodeIndex(nextEpisode);
        this.user().data.currentIndex = currentIndex;
        if (this.isAlexaSkill()) {
            this.alexaSkill().audioPlayer().setOffsetInMilliseconds(0).play(nextEpisode.url, `${currentIndex}`);
            this.endSession();
        } else if (this.isGoogleAction()) {
            this.googleAction().audioPlayer().play(nextEpisode.url, nextEpisode.title);
            this.googleAction().showSuggestionChips(['pause', 'start over']);
            this.ask('Enjoy');
        }
    },
    'PreviousIntent': function() {
        let currentIndex = this.user().data.currentIndex;
        let previousEpisode = Player.getPreviousEpisode(currentIndex);
        if (!previousEpisode) {
            this.tell('You are already at the oldest episode.');
            return;
        }
        currentIndex = Player.getEpisodeIndex(previousEpisode);
        this.user().data.currentIndex = currentIndex;
        if (this.isAlexaSkill()) {
            this.alexaSkill().audioPlayer().setOffsetInMilliseconds(0).play(previousEpisode.url, `${currentIndex}`);
            this.endSession();
        } else if (this.isGoogleAction()) {
            this.googleAction().audioPlayer().play(previousEpisode.url, previousEpisode.title);
            this.googleAction().showSuggestionChips(['pause', 'start over']);
            this.ask('Enjoy');
        }
    },
    'HelpIntent': function() {
        this.ask('You can either listen to episode one or the latest episode or choose from a random list of episodes. Which one would you like to do?');
    },
});

app.setAlexaHandler(AlexaHandler);
app.setGoogleActionHandler(GoogleHandler);

module.exports.app = app;
