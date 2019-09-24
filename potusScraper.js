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
async function LinksToValues(url) {
	try {
		let response;
		setTimeout(() => {throw new Error("Pelo amor de cristinho só vai"),2000});
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
			}
			return links;
		})
		return response;
	}
	catch (err) {
		console.log("Opa, esse site não existe mais!");
		console.log("Erro: " + err)
	}
}
/**
 * Pega uma série de sites dados e retorna uma matriz de Pagerank das conexões
 * entre elas
 * 
 * @param {Array} sites, um array de urls que serão checadas
 */
async function PageRank(sites) {
	console.log(sites.length)
	let result = nj.zeros([sites.length, sites.length]);
	for (let i = 0; i < sites.length; i++) {
		let links = await LinksToValues(sites[i]);
		let value;
		if (links != null) {
			if (links != []) value = 1 / links.length;
		} else { value = 0; }
		for (let site in links) {
			if (!value) break;
			console.log("Value " + value + " added to position " + (i, sites.indexOf(site)))
			result[i][sites.indexOf(site)] = value;
		}
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
	let websites = await ExtractWebsitesFromFile()
	let matrix = await PageRank(websites);

	console.log(matrix);
}

/**
 * TODO: - Entender como corrida funciona em JS
 */
function RaceTest() {
	let b = () => new Promise (resolve => 
		setTimeout(resolve("Aff vai logo")),100);
	let a = () => new Promise(resolve => 
		setTimeout(resolve("Resposta do cálculo longo é 32!"), 3000));
	
	Promise.race([a, b].map(f => f())).then(console.log)
	// let longTask = () => new Promise(resolve =>
	// 	setTimeout(() => resolve("Long task complete."), 300))

	// let timeout = (cb, interval) => () =>
	// 	new Promise(resolve => setTimeout(() => cb(resolve), interval))

	// let onTimeout = timeout(resolve =>
	// 	resolve("The 'maybeLongTask' ran too long!"), 200)

	// Promise.race([longTask, onTimeout].map(f => f())).then(console.log)
}

/* -- Flow principal da aplicação -- */

main()