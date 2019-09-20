/**
 * Bibliotecas necessárias para o Web Scraping
 */
const readline = require('readline');
const rp = require('request-promise');
const $ = require('cheerio');
const nj = require('numjs');
const fs = require('fs');

/**
 * Pega a url dada e retorna somente o domínio dela
 * @param {String} url 
 */
function GetDomain(url) {
	let strings = url.split('/');
	let result = null;
	for (let str of strings) {
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
					if (!links.includes(res)) {
						links.push(res);
					}
				}
			}
		}
		return links;
	})
}

function PageRank(sites) {
	console.log(sites.length)
	let result = nj.zeros([sites.length, sites.length]);
	for (let i = 0; i < sites.length; i++) {
		LinksToValues(sites[i]).then(function (links) {
			let value = 1 / links.length;
			for (let site in links) {
				console.log("Value " + value + "added to position " + (i, sites.indexOf(site)))
				result[i][sites.indexOf(site)] = value;
			}
		}
		)
	}
}

let reader = readline.createInterface({
	input: fs.createReadStream('properFile.csv')
});

let url = [];
function wtf() {
	let list = []
	reader.on('line', function (line) {
		list.push(line);
	}).on('close', function (line) {
		console.log(list);
		return list;
	})
}
url = wtf()
console.log(url)
//PageRank(url);
