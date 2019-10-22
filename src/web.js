const cheerio = require ("cheerio");

export class WebResource {

	websiteList;
	constructor(websiteList){
		this.websiteList = websiteList;
	}

	// Main Function
	WebsiteListToGraphMatrix(){}

	// Assist Functions
	WebsiteToRelatedLinksList(url){}
	ExtractDomainNameFromURL(url){}
}
