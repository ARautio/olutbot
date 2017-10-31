const request = require('request-promise-native')

/*
  OlutBot is done with help of
  https://github.com/carlo-colombo/serverless-telegram-bot-gc-functions
*/

function getToken(){
  const config = require('./config.js');
  // TODO: Move this to another folder
  if (process.env.NODE_ENV == 'production'){
    console.log("Config fetched through cloud-functions");
    return require('cloud-functions-runtime-config')
      .getVariable('prod-config', 'telegram/token')
  }
  console.log("Config fetched from string");
  return Promise.resolve(config.telegramtoken)
}

function getBeer(beerName){
  // TODO: Check if beer is found from alkos list and return information about it
}

/**
 * Search Olut functions.
 *
 * @param {object} request The Cloud Functions event.
 * @param {function} response The callback function.
 */
exports.olutbot = function olutbot(req, res) {
  console.log("Olutbot started");
  const {message:{chat, text}} = req.body
  const echo = `echo: ${text}`
  return getToken()
    .then( token => request.post({
      uri: `https://api.telegram.org/bot${token}/sendMessage`,
      json: true,
      body: {text: echo, chat_id: chat.id}
    }))
    .then(resp => {
      console.log(resp);
      res.send(resp);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err)
    })
};

const fetchAlko = require('./src/fetchAlko.js')
exports.fetchAlko = fetchAlko.fetchAlko
