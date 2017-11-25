const config = require('../config.js');
const shell = require('shelljs');
const { deployVariable, deployTopic, setWebhook } = require('./deployFunctions');

/* Check out that gcloud and curl are installed */
if (!shell.which('gcloud')) {
  shell.echo('Sorry, this script requires gcloud');
  shell.exit(1);
}
if (!shell.which('curl')) {
  shell.echo('Sorry, this script requires curl');
  shell.exit(1);
}
/* Check variable, deploy http trigger and fetchAlko trigger and setup webhook to telegram */
deployVariable(config.telegramtoken);
deployTopic('http', 'olutbot', config.bucket_name);
deployTopic('trigger', 'fetchAlko', config.bucket_name);
setWebhook('olutbot', config.project_id, config.telegramtoken);
