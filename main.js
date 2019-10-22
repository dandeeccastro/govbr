import FileResource from "src/file.js"
import WebResource from "src/web.js"
import PageRankResource from "src/pagerank.js"

function main(){
	const precision = 1;

	const file = new FileResource("assets/properFile.csv");
	const websiteList = file.ReadWebsiteListFromFile();
	const web = new WebResource(websiteList);
	const transformVector, graphMatrix = web.WebsiteListToGraphMatrix();
	const pg = new PageRankResource(transformVector, graphMatrix);
	file.WriteMatrixToFile(graphMatrix)
	const result = pg.SimplePageRank(precision);
	file.WriteResultToFile(result);
}

main();
