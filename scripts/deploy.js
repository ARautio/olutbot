'use strict';
const config = require('../config.js')

// TODO: Check that runtime-config is enabled and add telegram token from config.js

/* gcloud service-management enable runtimeconfig.googleapis.com */

/*gcloud beta runtime-config configs create prod-config
gcloud beta runtime-config configs variables \
    set telegram/token  "TELEGRAM_TOKEN" \
    --config-name prod-config */

// TODO: Deploy Olutbot application

/*gcloud beta functions deploy olutbot \
  --trigger-http \
  --entry-point echoBot \
  --stage-bucket unique-bucket-name */


// TODO: Set webhook

/* curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
     "url": "https://<GCP_REGION>-<PROJECT_ID>.cloudfunctions.net/olutbot"
   }' \
   https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook */
