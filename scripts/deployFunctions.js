const shell = require('shelljs');

/* Function to create telegram token */
module.exports.deployVariable = function deployVariable(telegramToken) {
  if (shell.exec('gcloud beta runtime-config configs list', { silent: true })
    .stdout.indexOf('prod-config') === 0) {
    shell.exec('gcloud beta runtime-config configs create prod-config');
  }

  if (shell.exec('gcloud beta runtime-config configs variables' +
    'list --config-name prod-config', { silent: true })
    .stdout.indexOf('telegram/token') === 0) {
    shell.exec('gcloud beta runtime-config configs variables' +
          `set telegram/token "${telegramToken}"` +
          '--config-name prod-config');
  } else {
    shell.echo('Telegram token exists');
  }
  shell.echo('Production variable ready to use');
};

module.exports.deployTopic = function deployTopic(method, topic, bucket) {
  shell.echo(`Started to deploy ${topic} to bucket ${bucket}`);
  const httpEntry = ` --trigger-http --entry-point ${topic} --stage-bucket ${bucket}`;
  const triggerEntry = ` --entry-point ${topic} --stage-bucket ${bucket}`;
  if (method === 'http') {
    shell.exec(`gcloud beta functions deploy ${topic} ${httpEntry}`);
  } else if (method === 'trigger') {
    shell.exec(`gcloud beta functions deploy ${topic} ${triggerEntry}`);
  }
};

module.exports.setWebhook = function setWebhook(topic, projectId, telegramToken) {
  const functionsList = shell.exec('gcloud beta functions list', { silent: true }).stdout.split('\n');
  const content = functionsList.map(line => line.split(/(\s{2,})/).filter(word => word.trim().length > 0));
  const regionN = content[0].indexOf('REGION');
  const olutbotFunction = content.filter(line => line[0] === topic)[0];
  const url = `https://${olutbotFunction[regionN]}-${projectId}.cloudfunctions.net/${topic}`;
  const telegramWebhook = shell.exec('curl -X POST -H "Content-Type: application/json" ' +
    `https://api.telegram.org/bot${telegramToken}/getWebhookInfo`, { silent: true }).stdout;
  if (JSON.parse(telegramWebhook).result.url !== url) {
    shell.exec('curl -X POST -H "Content-Type: application/json" -d' +
      `'{"url":"${url}"}'` +
      `https://api.telegram.org/bot${telegramToken}/setWebhook`);
    shell.echo(`Telegram webhook set to "${url}"`);
  } else {
    shell.echo(`Telegram webhook is ${JSON.parse(telegramWebhook).result.url}`);
  }
};
