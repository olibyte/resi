const express = require('express');
const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/web-api');

const router = express.Router();

module.exports = (params) => {
    const { config } = params;

    const slackEvents = createEventAdapter(config.slack.signingSecret);
    const slackWebClient = new WebClient(config.slack.token);

    router.use('/events', slackEvents.requestListener());

    //   async function handleMention(event) {
    //     return slackWebClient.chat.postMessage({
    //       text: 'Hi there, I\'m Resi. What can I do for you?',
    //       channel: event.channel,
    //       username: 'reservationapp',
    //     });
    //   }

    //   slackEvents.on('app_mention', handleMention);

    slackEvents.on('app_mention', e => {
        console.log("Got app_mention!")
        console.log(e)
        slackWebClient.chat.postMessage({
            channel: e.channel,
            text: 'Hi, what can I do for you?',
            username: 'reservationapp',
        })
            .then((res) => {
                console.log(res)
            }).catch(err => {
                console.error(err)
            })
    });
    return router;
};