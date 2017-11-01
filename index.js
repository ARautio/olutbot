const request = require('request-promise-native');
const config = require('./config.js');
const { searchBeer, convertResult, convertInlineResult } = require('./src/searchBeer.js');

/*
  OlutBot is done with help of
  https://github.com/carlo-colombo/serverless-telegram-bot-gc-functions
*/

function getToken() {
  if (process.env.NODE_ENV === 'production') {
    return require('cloud-functions-runtime-config')
      .getVariable('prod-config', 'telegram/token');
  }
  return Promise.resolve(config.telegramtoken);
}

/**
 * Search Olut functions.
 *
 * @param {object} request The Cloud Functions event.
 * @param {function} response The callback function.
 */
exports.olutbot = function olutbot(req, res) {
  const getTokenPromise = getToken();

  if (req.body.message !== undefined) {
    const { message: { chat, text } } = req.body;
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
  } else if (req.body.inline_query !== undefined) {
    const { inline_query: { id, query } } = req.body;
    const searchResult = searchBeer(query, 3);
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
  return null;
};

const fetchAlko = require('./src/fetchAlko.js');

exports.fetchAlko = fetchAlko.fetchAlko;
