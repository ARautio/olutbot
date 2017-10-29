# Olutbot

This is my attempt to learn and try Telegram Bot API and how to connect it with other services. I have used [carlo-colombo/serverless-telegram-bot-gc-functions](https://github.com/carlo-colombo/serverless-telegram-bot-gc-functions) to connect Telegram to Google Cloud.

### Prerequisites

* Goole Cloud account and a project. https://cloud.google.com/resource-manager/docs/creating-managing-projects
* Enable Google cloud functions. This one may lead to some costs. Alternatively Firebase functions should work too but I haven't tried.
* Get a telegram bot token, ask it to the [BotFather](https://telegram.me/BotFather).

### Set up

Edit config.js and add Botname, Google project and bucket name and Telegram token.

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
