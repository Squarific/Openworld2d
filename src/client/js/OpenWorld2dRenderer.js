function OpenWorld2dRenderer (container) {
	this.container = container;
	this.initContainer(this.container);
	window.addEventListener("resize", this.resizeCanvas.bind(this));
	this.resizeCanvas();
}

OpenWorld2dRenderer.prototype.initContainer = function initContainer (container) {
	utils.removeChildren(container);
	this.canvas = container.appendChild(document.createElement("canvas"));
	this.ctx = this.canvas.getContext("2d");
};

OpenWorld2dRenderer.prototype.draw = function draw (openWorld2d, camera) {
	this.renderMap(openWorld2d.heightMap, camera);
};

OpenWorld2dRenderer.prototype.renderMap = function renderMap (heightMap, camera) {
	var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
	    leftTopX = camera.centerX - this.canvas.width / 2,
	    leftTopY = camera.centerY - this.canvas.height / 2;
	for (var x = 0; x < this.canvas.width; x++) {
		for (var y = 0; y < this.canvas.height; y++) {
			var pixel = x * 4 + y * this.canvas.width * 4;
			var height = heightMap.getHeight((leftTopX + x) / camera.zoom, (leftTopY + y) / camera.zoom) + 1;
			imageData.data[pixel    ] = height * 127;
			imageData.data[pixel + 1] = height * 127;
			imageData.data[pixel + 2] = height * 127;
			imageData.data[pixel + 3] = 255;
		}
	}
	this.ctx.putImageData(imageData, 0, 0);
};

OpenWorld2dRenderer.prototype.resizeCanvas = function resizeCanvas () {
	this.canvas.width = this.container.offsetWidth;
	this.canvas.height = this.container.offsetHeight;
};