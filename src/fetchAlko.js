const rp = require('request-promise');
var cheerio = require('cheerio');


// TODO: Make script to fetch alkos productbase daily
// and update the beerlist to database
exports.fetchAlko = function (event){
  // Parse xls file from here: https://www.alko.fi/valikoimat-ja-hinnasto/hinnasto
  return rp('https://www.alko.fi/valikoimat-ja-hinnasto/hinnasto').then(function(process,handleError){
    var $ = cheerio.load(process);
    var url = null;
    $('a').each(function() {
      var text = $(this).text();
      var link = $(this).attr('href');
      if(text && text.match('Alkon hinnasto')){
        console.log(text + ' --> ' + link);
        url = 'https://www.alko.fi' + link;
      };
    });
    // Downloadfile
    const XLSX = require('xlsx'), request = require('request');
    request(url, {encoding: null}, function(err, res, data) {
      if(err || res.statusCode !== 200) return;

      // data is a node Buffer that can be passed to XLSX.read
      var workbook = XLSX.read(data, {type:'buffer'});
      var worksheet = workbook.Sheets[workbook.SheetNames[0]];
      // TODO: Read rows and add them to database
      // TODO: For Loop each row and check if category is beer
      // TODO: Then update database with name (if name not found create a new one)
      // TODO: https://cloud.google.com/datastore/docs/quickstart
    });
  });
}
