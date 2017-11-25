const algoliasearch = require('algoliasearch');
const config = require('../config.js');
const rp = require('request-promise');

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
    let beerInfo = null;
    if (beer.ratebeerID !== undefined) {
      beerInfo = `${beer.price}€\nRating: ${Math.round(beer.ratebeerRating * 100) / 100}` +
      ` from [Ratebeer](http://www.ratebeer.com/beer/${beer.ratebeerID}/)`;
    } else {
      beerInfo = `${beer.price}€`;
    }
    return `[${beer.name}](http://www.alko.fi/tuotteet/${beer.objectID})
            \nBy: ${beer.brewery}\n${beerInfo}\n`;
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
      let beerInfo = null;
      if (beer.ratebeerID !== undefined) {
        beerInfo = `${beer.price}€\nRating: ${Math.round(beer.ratebeerRating * 100) / 100}` +
        ` from [Ratebeer](http://www.ratebeer.com/beer/${beer.ratebeerID}/)`;
      } else {
        beerInfo = `${beer.price}€`;
      }
      const beerRow = {
        id: row,
        type: 'article',
        title: beer.name,
        input_message_content: {
          message_text: `[${beer.name}](http://www.alko.fi/tuotteet/${beer.objectID})
                          \nBy: ${beer.brewery}\n${beerInfo}\n`,
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

function updateSearch(beer) {
  const client = algoliasearch(config.algoliaAppID, config.algoliaIndex);
  const index = client.initIndex('beers');
  const algoliaBeer = [{
    objectID: beer.objectID,
    name: beer.name,
    brewery: beer.brewery,
    size: beer.size,
    price: beer.price,
    updated: beer.updated,
    ratebeerID: beer.ratebeerID,
    ratebeerRating: beer.ratebeerRating,
    ratebeerUpdated: new Date().toJSON(),
  }];
  index.saveObjects(algoliaBeer, (error, content) => {
    console.log(content);
  });
}

function searchFromRatebeer(result) {
  const beerResults = result;
  const ratebeerDev = 'https://api.r8.beer/v1/api/graphql/';
  const ratebeerProd = 'https://api.ratebeer.com/v1/api/graphql';
  const ratebeerUrl = (process.env.NODE_ENV === 'production' ? ratebeerProd : ratebeerDev);
  const options = {
    uri: ratebeerUrl,
    method: 'POST',
    headers: {
      'User-Agent': config.botname,
      'x-api-key': config.ratebeerAPIKey,
    },
    body: {
      query: `query { beerSearch(query: "${beerResults[0].hits[0].name}") { ` +
           'items { id,name, averageRating }}}',
    },
    json: true,
    transform: (body, response, resolveWithFullResponse) => {
      const content = body.data.beerSearch.items;
      beerResults[0].hits[0].ratebeerID = content[0].id;
      beerResults[0].hits[0].ratebeerRating = content[0].averageRating;
      updateSearch(beerResults[0].hits[0]);
      return beerResults;
    },
  };
  return rp(options);
}

/**
 * Checks out if the beer is in Ratebeer
 *
 * @param {object} result The result string from Algolia search.
 */
exports.checkRateBeer = function checkRateBeer(result) {
  const beerResult = result;
  let ratebeerPromise = null;
  if (result[0].hits !== undefined && result[0].hits.length > 0) {
    const beer = result[0].hits[0];
    if (beer.ratebeerUpdated === undefined && config.ratebeer === true) {
      console.log('Ratebeer not found, lets find');
      ratebeerPromise = searchFromRatebeer(beerResult);
    }
  }
  // If no results or id is already found
  if (ratebeerPromise === null) {
    ratebeerPromise = new Promise((resolve) => { resolve(beerResult); });
  }
  return ratebeerPromise;
};
