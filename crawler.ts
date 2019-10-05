const readline = require('readline');
const rp = require('request-promise');
const $ = require('cheerio');
const nj = require('numjs');
const fs = require('fs');
const { once } = require("events");

function GetDomain(url:string) :string {
    let strings: string[] = url.split('/');
    let result: string = null;
    for (let str of strings){
        if (str.includes('.gov.br')){
            result = str;
            break;
        }
    } if (result){
        let test : string[] = result.split(".").slice(-3);
        result = test.join();
        console.log(result);
    } return result;
}

async function LinksToValues(url: string):Promise<Array<string>>{
    let response;
    try {
        response = await rp(url).then(function (html:string){
            let bundle: any = $('a', html);
			let links: Array<string> = new Array() ;
			for (let i = 0; i < bundle.length; i++) {
				if (bundle[i].attribs.href) {
					let res:string = bundle[i].attribs.href;
					res = GetDomain(res);
					if (res) {
						if (!links.includes(res)) links.push(res);
					}
				}
			} return links;
        }); return response;
    } catch(err) {
        console.log("Opa, esse site não existe mais!")
    }
}

async function PageRank(sites:Array<string>):Promise<NdArray<number>>{
    let result = nj.zeros([sites.length,sites.length]);
    for (let i = 0; i < sites.length; i++){
        let value: number;
        let links: Array<string> = await LinksToValues(sites[i]);
        if (links && links != []) value = 1 / sites.length;
        else value = 0;
        for (let site in links){
            if (!value) break;
            let pos: number = sites.indexOf("https://" + site);
            if (pos != -1) {
                console.log("Value " + value + " added to position " + [i, pos]);
                result[i][pos] = value;
            }
        } console.log("Site " + (i + 1) + " de " + sites.length);
    } return result;
}

let reader: any = readline.createInterface({
    input: fs.createReadStream('properFile.csv')
});

async function ExtractWebsitesFromFile() : Promise<Array<string>> {
    let list = new Array<string>();
    reader.on('line',function(line:string){
        list.push(line);
    }); await once(reader,'close');
    return list 
}

async function main():Promise<void>{
    nj.config.printThreshold = 2000;
    let websites: Array<string> = await ExtractWebsitesFromFile();
    let matrix: NdArray<number> = await PageRank(websites);
    console.log(matrix);
}
