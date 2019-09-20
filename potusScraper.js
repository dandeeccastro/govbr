/**
 * Bibliotecas necessárias para o Web Scraping
 */
const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.gov.br';

function GetDomain(url) {
  let string = url;
  url.includes("https") ? string = url.slice(8) : string = url.slice(7);
  string = string.slice(0,string.indexOf('/'));
  return string;
}

/**
 * Pegando url e achando as tags a do html
 */
rp(url).then(function (html) {
  //success!
  let bundle = $('a', html);
  for (let i = 0; i < bundle.length; i++) {
    if (bundle[i].attribs.href) {
      let res = bundle[i].attribs.href;
      if (res.includes(".gov.br")) {
        console.log(GetDomain(res));
      };
    }
  }
})
  .catch(function (err) {
    //handle error
  });
