/**
 * Bibliotecas necessárias para o Web Scraping
 */
const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.gov.br';

/**
 * Pega a url dada e retorna somente o domínio dela
 * @param {String} url 
 */
function GetDomain(url) {
  let strings = url.split('/');
  let result = null;
  for (let str of strings){
	  if (str.includes('.gov.br')) {
		result = str;
		break;
	  }
  } return result;
}

/**
 * Pega a url dada, vê quais sites do governo ela aponta
 * e nos retorna uma promise que tem a array dentro porque
 * Javascript
 * 
 * @param {String} url 
 */
function LinksToValues(url) {
  return rp(url).then(function (html) {
		let bundle = $('a', html);
		let links = [];
		for (let i = 0; i < bundle.length; i++) {
			if (bundle[i].attribs.href) {
				let res = bundle[i].attribs.href;
				res = GetDomain(res);
				if (res) {
					// console.log(res)
					if (!links.includes(res)){
						links.push(res);
					}
				}
			}
		}
		return links;
	})
}
LinksToValues(url).then(function (links) {
	console.log(links, 1/links.length)
}) ;