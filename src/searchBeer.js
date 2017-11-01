const algoliasearch = require('algoliasearch');
const config = require('../config.js');

/**
 * Searches beer based on a name and results amount of results give by parameter.
 *
 * @param {string} beerName The search query about the beer.
 * @param {integer} amount The amount of results needed.
 */
exports.searchBeer = function searchBeer(beerName, amount) {
  const client = algoliasearch(config.algoliaAppID, config.algoliaIndex);
  const index = client.initIndex('beers');

  return index.search({ query: beerName, hitsPerPage: amount });
};

/**
 * Converts results to right format. This is when bot send a message.
 *
 * @param {object} result The result string from Algolia search.
 */
exports.convertResult = function convertResult(result) {
  if (result.hits !== undefined && result.hits.length > 0) {
    const beer = result.hits[0];
    return `[${beer.name}](http://www.alko.fi/tuotteet/${beer.objectID})
            \nBy:${beer.brewery}\n${beer.price}€\n`;
  }
  return 'No results';
};

/**
 * Converts results to right format. This is when bot shows inline messages.
 *
 * @param {object} result The result string from Algolia search.
 */
exports.convertInlineResult = function convertInlineResult(result) {
  if (result.hits !== undefined && result.hits.length > 0) {
    const beers = [];
    let row = 0;
    result.hits.forEach((beer) => {
      const beerRow = {
        id: row,
        type: 'article',
        title: beer.name,
        input_message_content: {
          message_text: `[${beer.name}](http://www.alko.fi/tuotteet/${beer.objectID})
                          \nBy:${beer.brewery}\n${beer.price}€\n`,
          parse_mode: 'Markdown',
        },
        url: `http://www.alko.fi/tuotteet/${beer.objectID}`,
      };
      row += 1;
      beers.push(beerRow);
    });
    return JSON.stringify(beers);
  }
  return JSON.stringify([]);
};
