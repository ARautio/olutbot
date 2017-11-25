const { jest, describe, test, expect } = require('jest');

const algoliasearch = jest.fn();

const { searchBeer } = require('./searchBeer.js');

describe('searchBeer', () => {
  /* Check that Olut search will resutl */
  test('Search for a Olut beer', () => {
    const query = 'Olut';

    searchBeer(query).then(result => expect(result).toEqual(expectedObject));
  });
  /* Empty result should return random result ? */
  test('Search with empty value', () => {

  });

  /* Search will return bad value */
  test('Search with bad value', () => {

  });
});

describe('Convert to values', () => {
  test('One item', () => {

  });

  test('Multiple items', () => {

  });

  test('No values', () => {

  });
});
