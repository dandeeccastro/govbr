/**
 * Bibliotecas necessárias para o Web Scraping
 */
const { once } = require("events");
const readline = require('readline');
const rp = require('request-promise');
const $ = require('cheerio');
const nj = require('numjs');
const fs = require('fs');

/**
 * Pega a url dada e retorna somente o domínio dela
 * @param {String} url do site 
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
 * @param {String} url, a url do site que se deseja saber para 
 * aonde aponta  
 */
function LinksToValues(url) {
	try {
		rp(url).then(function (html) {
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
	catch (err) {
		console.log('Opa');
	}
}
/**
 * Pega uma série de sites dados e retorna uma matriz de Pagerank das conexões
 * entre elas
 * 
 * TODO: - variável links está retornando undefined, o que fazer
 * 	- Unhandled rejection RequestError
 * 
 * @param {Array} sites, um array de urls que serão checadas
 */
async function PageRank(sites) {
	console.log(sites.length)
	let result = nj.zeros([sites.length, sites.length]);
	for (let i = 0; i < sites.length; i++) {
		let links = await LinksToValues(sites[i]);
		console.log(links);
		let value = 1 / links.length;
		for (let site in links) {
			console.log("Value " + value + " added to position " + (i, sites.indexOf(site)))
			result[i][sites.indexOf(site)] = value;
		}

	}
}

let reader = readline.createInterface({
	input: fs.createReadStream('properFile.csv')
});

async function ExtractWebsitesFromFile() {
	try {
		let list = []
		reader.on('line', function (line) {
			list.push(line);
		})
		await once(reader, 'close');
		return list;
	} catch (err) {
		console.log(err);
	}
}

async function main() {
	let websites = await ExtractWebsitesFromFile()
	PageRank(websites);
}

/* -- Flow principal da aplicação -- */

main()