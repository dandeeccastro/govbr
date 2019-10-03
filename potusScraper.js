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
	} if (result) {
		let test = result.split(".").slice(-3);
		test = test.join(".")
		console.log(test);
		result = test;
	}
	return result;
}

/**
 * Pega a url dada, vê quais sites do governo ela aponta
 * e nos retorna uma promise que tem a array dentro porque
 * Javascript
 *
 * @param {String} url, a url do site que se deseja saber para
 * aonde aponta
 */
async function LinksToValues(url) {
	let response;
	try {
		response = await rp(url).then(function (html) {
			let bundle = $('a', html);
			let links = [];
			for (let i = 0; i < bundle.length; i++) {
				if (bundle[i].attribs.href) {
					let res = bundle[i].attribs.href;
					res = GetDomain(res);
					if (res) {
						if (!links.includes(res)) links.push(res);
					}
				}
			} clearTimeout(time);
			return links;
		})
		return response;
	}
	catch (err) {
		// console.log("Opa, esse site não existe mais!");
		// console.log("Erro: " + err)
	}
}
/**
 * Pega uma série de sites dados e retorna uma matriz de Pagerank das conexões
 * entre elas
 *
 * @param {Array} sites, um array de urls que serão checadas
 */
async function PageRank(sites) {
	let result = nj.zeros([sites.length, sites.length]);
	for (let i = 0; i < sites.length; i++) {

		let value;
		let links = await LinksToValues(sites[i]);
		if (links && links != []) value = 1 / links.length;
		else value = 0;
		if (links != null) {
			if (links.length) value = 1 / links.length;
		} else { value = 0; }
		for (let site in links) {
			if (!value) break;
			let pos = sites.indexOf("https://" + site);
			if (pos != -1) {
				console.log("Value " + value + " added to position " + (i, pos))
				result[i][pos] = value;
			}
		}
		console.log("Site " + (i + 1) + " de " + sites.length);
	}
	return result;
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
	nj.config.printThreshold = 2000;
	let websites = await ExtractWebsitesFromFile()
	let matrix = await PageRank(websites);
	console.log(matrix);
}

function teste(url) {
	let p1 = new Promise ( resolve => {
		setTimeout(resolve,1000,"Am good");
	} )
	let p2 = new Promise ( reject => {
		setTimeout(reject,4000,"Am bad!");
	})
	Promise.race([p1,p2])
	.then( res => {console.log(res)})
	.catch( err => { console.log( err ) })
}
/* -- Flow principal da aplicação -- */
teste("https://eletrosul.gov.br");
/**
	- Atualmente retorna um array de zeros!
	- Faremos um teste controlado!
	- Promise.race não impede a Promise lenta de rodar
	- Plano: Tentar Observables
*/