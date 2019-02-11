// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
   alexaSkill: {
      nlu: 'alexa',
      manifest: {
         apis: {
            custom: {
               interfaces: [
                  {
                     type: 'AUDIO_PLAYER'
                  }
               ]
            }
         }
      },
      askProfile: 'private'
   },
   googleAction: {
      nlu: 'dialogflow',
      dialogflow: {
         projectId: 'podcastplayerv2',
         keyFile: './podcastplayerv2-d8653908d202.json'
      }
   },
   endpoint: '${JOVO_WEBHOOK_URL}',
};
