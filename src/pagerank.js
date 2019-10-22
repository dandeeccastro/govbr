export class PageRankResource {
	transformVector;
	transformationMatrix;

	constructor(transformVector,transformationMatrix){
		this.transformationMatrix = transformationMatrix;
		this.transformVector = transformVector;
	}

	SimplePageRank(precision){
		let resultVector = this.transformVector;
		for (let i = 0; i < precision; i++)
			resultVector *= this.transformationMatrix;
		return resultVector;
	}

}
