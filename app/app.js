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
const GoogleHandler = require('./google/handler.js');

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
app.setGoogleActionHandler(GoogleHandler);

module.exports.app = app;
