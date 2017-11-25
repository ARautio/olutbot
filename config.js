
function getConfigs() {
  const config = {
    botname: 'Olutbot',
    project_id: 'olutbot',
    bucket_name: 'olutbot',
    telegramtoken: 'telegramtoken',
    algoliaAppID: 'algoliaid',
    algoliaIndex: 'algoliaindex',
    ratebeer: true,
    ratebeerAPIKey: 'ratebeerapikey',
  };
  return config;
}

module.exports = getConfigs();
