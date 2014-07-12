function OpenWorld2dRenderer (container) {
	this.container = container;
	this.initContainer(this.container);
}

OpenWorld2dRenderer.prototype.initContainer = function initContainer (container) {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
	this.canvas = container.appendChild(document.createElement("canvas"));
	this.ctx = this.canvas.getContext("2d");
};

OpenWorld2dRenderer.prototype.draw = function draw (openWorld2d, camera) {
	this.renderMap(openWorld2d.heightMap, camera);
};

OpenWorld2dRenderer.prototype.renderMap = function renderMap (heightMap) {
	
};