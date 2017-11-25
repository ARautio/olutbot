const fetchAlko = require('./src/fetchAlko.js');
const olutbot = require('./src/olutbot.js');

/*
  OlutBot is done with help of
  https://github.com/carlo-colombo/serverless-telegram-bot-gc-functions
*/

exports.olutbot = olutbot.olutbot;
exports.fetchAlko = fetchAlko.fetchAlko;
