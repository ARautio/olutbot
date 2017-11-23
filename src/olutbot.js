const request = require('request-promise-native');
const config = require('../config.js');
const runtimeConfig = require('cloud-functions-runtime-config');
const { searchBeer, convertResult, convertInlineResult } = require('./searchBeer.js');


/**
 * getToken function
 *
 */
function getToken() {
  if (process.env.NODE_ENV === 'production') {
    return runtimeConfig.getVariable('prod-config', 'telegram/token');
  }
  return Promise.resolve(config.telegramtoken);
}

/**
 * getToken function
 *
 * @param {object} message The input message from telegram which is defined in
 * https://core.telegram.org/bots/api#message
 * @param {function} response The callback function from Cloud functions.
 */
function respondToMessage(message, res) {
  const getTokenPromise = getToken();
  const { message: { chat, text } } = message;
  const searchResult = searchBeer(text, 1);
  return Promise.all([searchResult, getTokenPromise])
    .then(resulttoken => request.post({
      uri: `https://api.telegram.org/bot${resulttoken[1]}/sendMessage`,
      json: true,
      body: { text: convertResult(resulttoken[0]), chat_id: chat.id, parse_mode: 'Markdown' },
    }))
    .then((resp) => {
      res.send(resp);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

/**
 * respondToInlineQuery function
 *
 * @param {object} message The input query from telegram which is defined in
 * https://core.telegram.org/bots/api#inlinequery
 * @param {function} response The callback function from Cloud functions.
 */
function respondToInlineQuery(message, res) {
  const getTokenPromise = getToken();
  const { inline_query: { id, query } } = message;
  const searchResult = searchBeer(query, 10);
  return Promise.all([searchResult, getTokenPromise])
    .then(resulttoken => request.post({
      uri: `https://api.telegram.org/bot${resulttoken[1]}/answerInlineQuery`,
      json: true,
      body: { results: convertInlineResult(resulttoken[0]), inline_query_id: id },
    }))
    .then((resp) => {
      res.send(resp);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

/**
 * Search Olut functions.
 *
 * @param {object} request The Cloud Functions event.
 * @param {function} response The callback function.
 */

exports.olutbot = function olutbot(req, res) {
  // Message param tells this is a message
  if (req.body.message !== undefined) {
    return respondToMessage(req.body, res);

  // Inline query param tells that this is an inline query
  } else if (req.body.inline_query !== undefined) {
    return respondToInlineQuery(req.body, res);
  }
  return null;
};
