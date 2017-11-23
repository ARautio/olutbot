const rp = require('request-promise');
const cheerio = require('cheerio');
const XLSX = require('xlsx');
const request = require('request');
const algoliasearch = require('algoliasearch');
// Instead of DataStore we use algoliasearch for this one
// const Datastore = require('@google-cloud/datastore');
const config = require('../config.js');


// TODO: Make script to fetch alkos productbase daily
// and update the beerlist to database
exports.fetchAlko = function fetchAlko(event) {
  // Parse xls file from here: https://www.alko.fi/valikoimat-ja-hinnasto/hinnasto
  return rp('https://www.alko.fi/valikoimat-ja-hinnasto/hinnasto').then((process,handleError) => {
    const $ = cheerio.load(process);
    let url = null;
    $('a').each(function content() {
      const text = $(this).text();
      const link = $(this).attr('href');
      if (text && text.match('Alkon hinnasto')) {
        console.log(`${text} --> ${link}`);
        url = `https://www.alko.fi${link}`;
      }
    });
    // Downloadfile
    console.log('Downloading', url);
    request(url, { encoding: null }, (err, res, data) => {
      if (err || res.statusCode !== 200) return;
      // data is a node Buffer that can be passed to XLSX.read
      const workbook = XLSX.read(data, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      let client = algoliasearch(config.algoliaAppID, config.algoliaIndex);
      let index = client.initIndex('beers');

      /*const datastore = Datastore({
        projectId: config.project_id,
      });*/

      let row = 4;
      const beers = [];
      while (worksheet[`A${row}`] !== undefined) {
        if (worksheet[`I${row}`] !== undefined &&
            (worksheet[`I${row}`].v === 'oluet' ||
            worksheet[`I${row}`].v === 'siiderit')) {
          const beer = {
            objectID: worksheet[`A${row}`].v,
            name: worksheet[`B${row}`].v,
            brewery: worksheet[`C${row}`].v,
            size: worksheet[`D${row}`].v,
            price: worksheet[`E${row}`].v,
            updated: new Date().toJSON(),
          };
          beers.push(beer);
        }
        row += 1;
      }
      /* let batch = 0;
      while (batch < beers.length / 500) {
        datastore.save(beers.slice((batch * 500) + 1, (batch + 1) * 500));
        batch += 1;
      } */
      index.saveObjects(beers, (error, content) => {
        console.log(content);
      });
    });
  });
};
