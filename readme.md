# Olutbot - Telegram bot

This is my attempt to learn and try Telegram Bot API and how to connect it with other services. I have used [carlo-colombo/serverless-telegram-bot-gc-functions](https://github.com/carlo-colombo/serverless-telegram-bot-gc-functions) to connect Telegram to Google Cloud.

I ended up selecting Algolia search for a backend to create an easy solution but basically any database which has some kind of search functionalities works the same way. If you want to use your own, just edit searchBeer and fetchAlko according to your needs.

### Prerequisites

* Goole Cloud account and a project. https://cloud.google.com/resource-manager/docs/creating-managing-projects
* Enable Google cloud functions. This one may lead to some costs. Alternatively Firebase functions should work too but I haven't tried.
* Get a telegram bot token, ask it to the [BotFather](https://telegram.me/BotFather).
* Create an account to [Algolia](https://www.algolia.com/) for search functionalities.

### Set up

Edit config.js and add Botname, Google project and bucket name and Telegram token, Algolia tokens.

Deployment script doesn't work yet so you need to do following steps manually before that.

1. Enable runtimeconfig and create config from telegram script.
2. Deploy olutbot and fetchAlko functions to Google cloud functions.
3. Set up telegram webhook to automatically get connections.

### Testing

Local testing can be done with a local Cloud Functions emulator.

```
npm -g install @google-cloud/functions-emulator

functions start
functions deploy olutbot --trigger-http

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
     "message": {
       "chat": {
         "id": 123
       },
       "text": "Oispa kaljaa"
     }
   }' \
   http://localhost:8010/PROJECT_ID/us-central1/olutbot

# To tail logs
watch functions logs read

```
